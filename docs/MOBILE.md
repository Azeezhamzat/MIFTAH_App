# Android app (Capacitor)

## Why this is a WebView shell, not a standalone app

The web and desktop apps both run the same thing: a Next.js server (SSR pages, API routes) backed by Prisma/SQLite.
Android has no practical way to run that server-side stack inside an app — there's no equivalent of Electron's
"bundle Node and spawn it as a child process" on Android without extremely fragile, unofficial tooling
(`nodejs-mobile`-style projects exist, but embedding a full Node + native Prisma engine + SQLite this way is a
different order of complexity and risk than this app's other two platforms, and wasn't attempted here).

The honest, working alternative: the Android app (`android/`, via [Capacitor](https://capacitorjs.com)) is a native
WebView shell pointed at a Miftāḥ server you already have running — your desktop app, `npm run dev` on your home
network, or a deployed instance (see [`docs/DEPLOYMENT.md`](DEPLOYMENT.md)). Once you've opened `/offline` in it at
least once while connected and downloaded the curriculum, the **exact same offline PWA mechanism already built for
the browser** (`/offline`, `public/sw.js`, IndexedDB) keeps working — Android's WebView is Chromium-based and
supports both IndexedDB and service workers, so offline lesson/exercise practice on the phone works the same way
it does on desktop, with no Android-specific code needed for that part.

## Configuring the server address

`capacitor.config.json`'s `server.url` is where the app points:

```json
{ "server": { "url": "http://10.0.2.2:3000", "cleartext": true } }
```

`10.0.2.2` is the Android emulator's alias for your host machine's `localhost` — the default is set up for testing
in the emulator against a server running on the same computer. For a real device on the same Wi-Fi network, change
it to your computer's LAN IP (e.g. `http://192.168.1.23:3000`); for a deployed instance, use its real URL (and
drop `cleartext: true`, which only exists to allow plain `http://` for local testing — a real deployment should use
`https://`). After changing it, re-run `npm run android:sync` before rebuilding.

## Building

This sandbox has no Android SDK/Gradle, so the APK itself couldn't be built or tested here — everything up to that
point (the Capacitor project scaffold, `npx cap sync android`) was run and verified in this environment.

**On a machine with Android Studio installed:**

```bash
npm run android:sync
npm run android:build   # or just open android/ in Android Studio and hit Run
```

The debug APK lands at `android/app/build/outputs/apk/debug/app-debug.apk` — install it directly on a device with
`adb install`, or copy it over and open it (you'll need to allow installs from unknown sources, normal for a
sideloaded personal app).

**Without Android Studio:** `.github/workflows/build-android.yml` is a manual (`workflow_dispatch`) GitHub Actions
workflow that builds the debug APK on a GitHub-hosted runner (which does have the Android SDK) and uploads it as a
downloadable artifact — trigger it from the repo's Actions tab.

## Known limitations

- **No account/session sharing across devices** beyond whatever the server itself provides — sign in on the phone
  the same way you would in a browser, against the same server.
- **Debug-signed only.** `assembleDebug` produces a debug-signed APK, fine for installing on your own device but
  not for any kind of store distribution (which is out of scope for a personal app).
- **Requires reaching a live server at least once** before offline study works on that device, exactly like the
  browser PWA.
