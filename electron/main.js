// Electron main process: runs the same Next.js server the web app uses
// (built with `output: 'standalone'`) as a child process against a SQLite
// database kept in the OS's per-user app-data directory, and shows it in a
// plain BrowserWindow. There is no separate "desktop app" codebase — this
// is the identical web app, just launched locally instead of visited in a
// browser, which is why every feature (including the Claude-key settings
// and offline study mode) works the same way here.
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const { spawn } = require('child_process');
const tar = require('tar');

const PORT = 4317;
let serverProcess = null;
let mainWindow = null;

function resourcesPath() {
  return app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
}

// The standalone Next.js server is shipped as app-data/standalone.tar.gz
// rather than a plain directory (see scripts/prepare-electron.js for why),
// so it must be extracted somewhere writable before it can run. Re-extract
// whenever the packaged app's version changes, so updates actually take
// effect instead of silently running a stale, previously-extracted server.
function ensureStandaloneServer(userDataDir) {
  const standaloneDir = path.join(userDataDir, 'standalone');
  const versionFile = path.join(userDataDir, 'standalone-version.txt');
  const currentVersion = app.getVersion();
  const extractedVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf8').trim() : null;

  if (extractedVersion !== currentVersion || !fs.existsSync(path.join(standaloneDir, 'server.js'))) {
    fs.rmSync(standaloneDir, { recursive: true, force: true });
    fs.mkdirSync(standaloneDir, { recursive: true });
    tar.x({ file: path.join(resourcesPath(), 'app-data', 'standalone.tar.gz'), cwd: standaloneDir, sync: true });
    fs.writeFileSync(versionFile, currentVersion);
  }

  return standaloneDir;
}

// First launch: seed the user's app-data directory with a copy of the
// pre-built curriculum database (shipped in app-data/template.db) and a
// freshly generated NEXTAUTH_SECRET, persisted in config.json so sessions
// survive app restarts. Later launches reuse both untouched.
function ensureUserData() {
  const userDataDir = app.getPath('userData');
  fs.mkdirSync(userDataDir, { recursive: true });

  const dbPath = path.join(userDataDir, 'miftah.db');
  if (!fs.existsSync(dbPath)) {
    const templateDb = path.join(resourcesPath(), 'app-data', 'template.db');
    fs.copyFileSync(templateDb, dbPath);
  }

  const configPath = path.join(userDataDir, 'config.json');
  let config;
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    config = { nextAuthSecret: crypto.randomBytes(32).toString('base64') };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  const standaloneDir = ensureStandaloneServer(userDataDir);

  return { dbPath, nextAuthSecret: config.nextAuthSecret, standaloneDir };
}

function startServer() {
  const { dbPath, nextAuthSecret, standaloneDir } = ensureUserData();
  const serverPath = path.join(standaloneDir, 'server.js');

  // Spawning Electron's own binary with ELECTRON_RUN_AS_NODE makes it behave
  // as a plain Node runtime for this child process — no separate Node
  // binary needs to be bundled.
  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: standaloneDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: String(PORT),
      HOSTNAME: '127.0.0.1',
      DATABASE_URL: `file:${dbPath}`,
      NEXTAUTH_SECRET: nextAuthSecret,
      NEXTAUTH_URL: `http://127.0.0.1:${PORT}`,
      NODE_ENV: 'production',
    },
    stdio: 'inherit',
  });
}

function waitForServer(retriesLeft = 75) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(`http://127.0.0.1:${PORT}/signin`, () => resolve());
      req.on('error', () => {
        if (retriesLeft <= 0) return reject(new Error('Server did not start in time.'));
        setTimeout(() => waitForServer(retriesLeft - 1).then(resolve, reject), 200);
      });
    };
    attempt();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    title: 'مِفْتَاح — Miftāḥ',
    backgroundColor: '#fdfbf6',
    webPreferences: { contextIsolation: true },
  });

  try {
    await waitForServer();
    await mainWindow.loadURL(`http://127.0.0.1:${PORT}/dashboard`);
  } catch (err) {
    await mainWindow.loadURL(
      `data:text/html,<body style="font-family:sans-serif;padding:2rem"><h2>Miftāḥ failed to start</h2><p>${String(err.message)}</p></body>`,
    );
  }
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});
