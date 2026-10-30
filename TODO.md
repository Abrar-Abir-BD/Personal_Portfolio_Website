# TODO: Deploy to cPanel shared hosting via Git

Build locally, push `dist/` to a `deploy` branch, and let cPanel pull it and copy it into `public_html`.

## Project setup (one-time)

- [ ] Create `public/.cpanel.yml`, replacing `CPUSER` with the cPanel username (change the path if the site is on a subdomain or addon domain):
  ```yaml
  ---
  deployment:
    tasks:
      - export DEPLOYPATH=/home/CPUSER/public_html/
      - /bin/rsync -a --exclude=.git --exclude=.cpanel.yml ./ $DEPLOYPATH
  ```
- [ ] Create `public/.htaccess` (only needed if subpages use real URL paths, such as `/projects`):
  ```apache
  DirectorySlash Off
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  # Prerendered pages (/projects/x -> projects/x/index.html), no trailing-slash redirect
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.+?)/?$ $1/index.html [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```
- [ ] Create `deploy.sh` in the project root:
  ```bash
  #!/usr/bin/env bash
  set -e
  npm ci && npm run build
  cd dist
  git init -q -b deploy
  git add -A
  git commit -qm "deploy $(date +%F_%T)"
  git push -f https://github.com/Abrar-Abir-BD/Personal_Portfolio_Website.git deploy
  rm -rf .git
  ```
- [ ] `chmod +x deploy.sh`
- [ ] Commit `public/.cpanel.yml`, `public/.htaccess` and `deploy.sh` to `main`
- [ ] Run `./deploy.sh` once so the `deploy` branch exists on GitHub

## cPanel setup (one-time)

- [ ] If the repo is private: in cPanel, go to **SSH Access → Generate Key** and authorize the key, then add the public key on GitHub (repo → Settings → Deploy keys) and use the SSH clone URL below
- [ ] In **Git™ Version Control → Create**, turn on **Clone a Repository**
  - Clone URL: `https://github.com/Abrar-Abir-BD/Personal_Portfolio_Website.git`
  - Repository Path: `/home/CPUSER/repositories/portfolio` (outside `public_html`)
  - Repository Name: `portfolio`
- [ ] In **Manage → Basic Information**, switch the checked-out branch to `deploy`
- [ ] In **Manage → Pull or Deploy**, click **Deploy HEAD Commit** and check the Deploy log
- [ ] Open the live site and check that the page, 3D model and subpages load

## Every deploy

- [ ] Run `./deploy.sh`
- [ ] In cPanel, go to **Git Version Control → Manage → Pull or Deploy**
- [ ] Click **Update from Remote**, then **Deploy HEAD Commit**

## Maintenance

- [ ] Every so often, clear stale hashed files from `public_html/assets/` (rsync runs without `--delete` so it never removes `.well-known/`, `cgi-bin/` or other server files)
- [ ] Never edit files inside `~/repositories/portfolio` on the server (cPanel won't deploy if that copy has uncommitted changes)
- [ ] If the host has no Git Version Control: upload the contents of `dist/` through File Manager or FTP instead

# TODO: Code fixes (from thigns.md review)

## P1: Accessibility

- [ ] **Navbar: Escape doesn't close the mobile menu when focus is inside it** (`src/components/Navbar.tsx`, `close` in the `menuOpen` effect)
  - The `.nav-glass` "inside the menu" check runs for key events too, so Escape from a focused menu link is ignored
  - Fix: close on Escape first, and apply the inside check only to `pointerdown`; move focus back to the menu button after closing
- [ ] **Certificate viewer: no focus handling** (`src/components/CertificatesPage.tsx`, the `role="dialog"` viewer)
  - It has `aria-modal` and Escape, but focus doesn't move in, isn't trapped, and isn't restored on close
  - Fix: on open, focus the close button (or the dialog); keep Tab / Shift+Tab inside it; on close, focus the card that opened it. Consider the native `<dialog>` + `showModal()`, which handles the trap and Escape
- [ ] **Reduced motion is not respected everywhere** (`src/components/utils/initialFX.ts`, `Landing.tsx`, `Navbar.tsx` ScrollSmoother, `Character/Scene.tsx`)
  - The art page honours it; the intro timeline, rotating roles, smooth scrolling and 3D motion don't
  - Fix: one shared `prefersReducedMotion` check (`matchMedia("(prefers-reduced-motion: reduce)")`); when set, skip the intro timeline, show one static role, don't create ScrollSmoother, and hold the 3D model still

## P2: 3D scene

- [ ] **Model resources are not released on unmount** (`src/components/Character/Scene.tsx`)
  - Cleanup disposes the renderer only; traverse the model and dispose each geometry, material and texture
- [ ] **Model load failures are unhandled** (`loadCharacter().then(...)` has no `.catch`)
  - Add `.catch` and show a static fallback image instead of an empty canvas
- [ ] **The render loop runs when nothing is visible**
  - Stop `requestAnimationFrame` while the section is off-screen, the tab is hidden, or a subpage is open (`onAwayChange` in `src/router.ts`); restart when it comes back

## P3: CI

- [ ] **No CI workflow** (`.github/workflows/ci.yml`)
  - On push/PR: `npm ci`, `npx tsc -b`, `npm run lint`, `npm run build`
  - Fix `npm run lint` first: ESLint currently crashes in `@typescript-eslint/no-unused-expressions` (eslint / typescript-eslint version mismatch, update `typescript-eslint`)
- [ ] **Smoke test** (optional, after CI): one Playwright test that loads `/`, opens a project page, goes back, and checks there are no console errors
