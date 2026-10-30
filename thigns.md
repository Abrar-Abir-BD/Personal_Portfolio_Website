Certificate viewer lacks proper modal focus management

The viewer has role="dialog" and Escape-key handling, but does not move focus into the dialog, trap keyboard focus, or restore focus on close. Keyboard users can encounter inaccessible navigation.

Fix: Use a tested accessible dialog primitive or implement focus lifecycle, keyboard trapping, and focus restoration.

CertificatesPage.tsx



Medium
Mobile menu Escape-key handling is incorrect

In Navbar.tsx, an Escape event originating inside .nav-glass is ignored because the handler treats it like a pointer event inside the menu. Escape therefore fails to close the menu when its links or controls are focused.

Fix: Handle Escape before testing whether a pointer event occurred inside the navigation.

Navbar.tsx



Medium
3D scene resource cleanup is incomplete

Scene.tsx clears the scene and disposes the renderer, but does not explicitly traverse and release the loaded model's geometries, materials, and textures. Model load failures also lack a caught rejection in the component.

Fix: Dispose resources deterministically, handle loading failures, and provide a static fallback. Stop scheduling animation frames when rendering is unnecessary.

Scene.tsx



Medium
Animations don't consistently respect reduced-motion preferences

The art page has reduced-motion-aware GSAP logic, but the primary landing introduction, rotating roles, smooth scrolling, and 3D motion do not consistently observe that preference.

Fix: Centralize motion preferences, skip unnecessary timelines, and provide a static presentation where appropriate.

initialFX.ts



Medium
No automated test or CI pipeline is committed

The repository has a strict TypeScript configuration and ESLint, but no committed test suite or GitHub Actions workflow. Changes to routing, animations, and 3D rendering lack automated regression protection.

Fix: Add GitHub Actions running type-checking, linting, tests, builds, and browser smoke tests.