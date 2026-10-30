---
name: gortex-components-5-dirs
description: "Work in the components +5 dirs area — 86 symbols across 14 files (83% cohesion)"
---

# components +5 dirs

86 symbols | 14 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `external-call::stdlib:gsap`
- `src/components/ArtPage.tsx`
- `src/components/Awards.tsx`
- `src/components/Character/utils/lighting.ts`
- `src/components/Cursor.tsx`
- `src/components/Navbar.tsx`
- `src/components/SocialIcons.tsx`
- `src/components/WhatIDo.tsx`
- `src/components/utils/GsapScroll.ts`
- `src/components/utils/initialFX.ts`
- `src/components/utils/splitText.ts`
- `src/data/portfolioContent.ts`
- `src/router.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | add, querySelectorAll, getElementById, querySelector, forEach, ... |
| `external-call::stdlib:gsap` | gsap |
| `src/components/ArtPage.tsx` | details, ArtPage, pics, root, slide, ... |
| `src/components/Awards.tsx` | toggle |
| `src/components/Character/utils/lighting.ts` | duration, pointLight, setLighting, directionalLight, ease, ... |
| `src/components/Cursor.tsx` | cursorRef, Cursor |
| `src/components/Navbar.tsx` | self, triggers.onToggle |
| `src/components/SocialIcons.tsx` | moving, onMouseMove, x, updatePosition, SocialIcons, ... |
| `src/components/WhatIDo.tsx` | index, WhatIDo, setRef, setRef, el, ... |
| `src/components/utils/GsapScroll.ts` | setCharTimeline, tl3, tM2, intensity, character, ... |
| `src/components/utils/initialFX.ts` | tween, initialFX, rotateRoles, split, selector, ... |
| `src/components/utils/splitText.ts` | paras, anim, showIfPassed, TriggerStart, setSplitText, ... |
| `src/data/portfolioContent.ts` | size, artImage, name |
| `src/router.ts` | fromMain, go, subpageScroller, href, notify |

## Entry Points

- `src/components/ArtPage.tsx::ArtPage`
- `src/components/utils/initialFX.ts::initialFX`
- `src/components/Cursor.tsx::Cursor`
- `src/components/SocialIcons.tsx::SocialIcons`
- `src/components/WhatIDo.tsx::WhatIDo`

## Connected Communities

- **Character/utils +6 dirs** (13 cross-edges)
- **components +1 dirs · map** (8 cross-edges)
- **components +1 dirs · scrollToSection** (2 cross-edges)
- **components +1 dirs · replace** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-15")
explore(operation:"context", task:"understand components +5 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/ArtPage.tsx::ArtPage"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
