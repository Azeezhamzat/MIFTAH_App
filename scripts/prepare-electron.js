// Assembles everything the Electron build needs on top of a normal
// `next build`: Next's standalone output doesn't include static assets or
// public/ (that's documented Next.js behavior, not an oversight), and the
// desktop app additionally ships a pre-seeded SQLite database as its
// first-run template (see electron/main.js).
//
// The finished standalone bundle is packed into a single tarball rather
// than left as a raw directory tree. electron-builder's file-copying logic
// specially intercepts any directory literally named "node_modules" —
// including inside extraResources — and silently drops it, assuming it's
// meant to go through its own dependency-resolution packing instead of a
// verbatim copy. Since .next/standalone/node_modules is a pre-built,
// self-contained bundle that must be copied byte-for-byte, packing it into
// one opaque .tar.gz file sidesteps that logic entirely; electron/main.js
// extracts it into the user's app-data directory on first launch.
const fs = require('fs');
const path = require('path');
const tar = require('tar');

const root = path.join(__dirname, '..');
const standaloneDir = path.join(root, '.next', 'standalone');
const appDataDir = path.join(root, 'build-resources', 'app-data');

function copyRecursive(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
}

if (!fs.existsSync(standaloneDir)) {
  console.error('Run "npm run build" first — .next/standalone was not found.');
  process.exit(1);
}

console.log('Copying .next/static into the standalone bundle...');
copyRecursive(path.join(root, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));

console.log('Copying public/ into the standalone bundle...');
copyRecursive(path.join(root, 'public'), path.join(standaloneDir, 'public'));

console.log('Copying prisma/schema.prisma into the standalone bundle...');
fs.mkdirSync(path.join(standaloneDir, 'prisma'), { recursive: true });
fs.copyFileSync(path.join(root, 'prisma', 'schema.prisma'), path.join(standaloneDir, 'prisma', 'schema.prisma'));

const templateDbSource = path.join(root, 'prisma', 'dev.db');
if (!fs.existsSync(templateDbSource)) {
  console.error('prisma/dev.db not found — run "npm run db:push && npm run db:seed" first so the desktop build ships a pre-seeded curriculum.');
  process.exit(1);
}
console.log('Copying the pre-seeded database as the desktop app\'s first-run template...');
fs.mkdirSync(appDataDir, { recursive: true });
fs.copyFileSync(templateDbSource, path.join(appDataDir, 'template.db'));

console.log('Packing the standalone server bundle into a tarball...');
tar.c({ gzip: true, file: path.join(appDataDir, 'standalone.tar.gz'), cwd: standaloneDir, sync: true }, ['.']);

console.log('Electron resources ready.');
