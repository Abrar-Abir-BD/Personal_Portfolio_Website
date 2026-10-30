# TODO: Deploy to cPanel shared hosting via Git

Build locally, push `dist/` to a `deploy` branch, and let cPanel pull it and copy it into `public_html`.



## Maintenance

- [ ] Every so often, clear stale hashed files from `public_html/assets/` (rsync runs without `--delete` so it never removes `.well-known/`, `cgi-bin/` or other server files)
- [ ] Never edit files inside `~/repositories/portfolio` on the server (cPanel won't deploy if that copy has uncommitted changes)
- [ ] If the host has no Git Version Control: upload the contents of `dist/` through File Manager or FTP instead

# TODO: Code fixes (from thigns.md review)

## P1: Accessibility

- [x] **Navbar: Escape doesn't close the mobile menu when focus is inside it** (`src/components/Navbar.tsx`, `close` in the `menuOpen` effect)
  - The `.nav-glass` "inside the menu" check runs for key events too, so Escape from a focused menu link is ignored
  - Fix: close on Escape first, and apply the inside check only to `pointerdown`; move focus back to the menu button after closing
- [x] **Certificate viewer: no focus handling** (`src/components/CertificatesPage.tsx`, the `role="dialog"` viewer)
  - It has `aria-modal` and Escape, but focus doesn't move in, isn't trapped, and isn't restored on close
  - Fix: on open, focus the close button (or the dialog); keep Tab / Shift+Tab inside it; on close, focus the card that opened it. Consider the native `<dialog>` + `showModal()`, which handles the trap and Escape
- [x] **Reduced motion is not respected everywhere** (`src/components/utils/initialFX.ts`, `Landing.tsx`, `Navbar.tsx` ScrollSmoother, `Character/Scene.tsx`)
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
