---
name: gortex-character-utils-6-dirs
description: "Work in the Character/utils +6 dirs area — 66 symbols across 13 files (74% cohesion)"
---

# Character/utils +6 dirs

66 symbols | 13 files | 74% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Character/Scene.tsx`
- `src/components/Character/utils/animationUtils.ts`
- `src/components/Character/utils/character.ts`
- `src/components/Character/utils/lighting.ts`
- `src/components/Character/utils/mouseUtils.ts`
- `src/components/Character/utils/resizeUtils.ts`
- `src/components/HoverLinks.tsx`
- `src/components/MainContainer.tsx`
- `src/components/Navbar.tsx`
- `src/components/utils/GsapScroll.ts`
- `src/context/LoadingProvider.tsx`
- `src/data/portfolioContent.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | removeEventListener, clear, create, removeChild, race, ... |
| `src/components/Character/Scene.tsx` | element, hoverDivRef, onTouchStart, event, Scene, ... |
| `src/components/Character/utils/animationUtils.ts` | hover, gltf, onHoverFace, isHovering, hoverDiv, ... |
| `src/components/Character/utils/character.ts` | scene, loader, renderer, dracoLoader, setCharacter, ... |
| `src/components/Character/utils/lighting.ts` | turnOnLights |
| `src/components/Character/utils/mouseUtils.ts` | handleTouchEnd, setMousePosition |
| `src/components/Character/utils/resizeUtils.ts` | height, width, handleResize, camera, canvasDiv, ... |
| `src/components/HoverLinks.tsx` | HoverLinks |
| `src/components/MainContainer.tsx` | isDesktopView, MainContainer, finishLoading, setIsDesktopView, resizeHandler |
| `src/components/Navbar.tsx` | setMenuOpen, setTheme, Navbar, toggleTheme, toggleTheme, ... |
| `src/components/utils/GsapScroll.ts` | killCharTimeline |
| `src/context/LoadingProvider.tsx` | context, useLoading |
| `src/data/portfolioContent.ts` | ArtLayout, Landing, Contact, Artwork, About, ... |

## Entry Points

- `src/components/Character/Scene.tsx::Scene`
- `src/components/Navbar.tsx::Navbar`
- `src/components/MainContainer.tsx::MainContainer`
- `src/components/Character/Scene.tsx::onTouchStart`
- `src/components/Character/utils/animationUtils.ts::onHoverFace`

## Connected Communities

- **components +5 dirs** (9 cross-edges)
- **components +1 dirs · scrollToSection** (3 cross-edges)
- **Character/utils +1 dirs** (3 cross-edges)
- **components +1 dirs · map** (2 cross-edges)
- **. +1 dirs · delete** (1 cross-edges)
- **Character/utils +2 dirs** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-20")
explore(operation:"context", task:"understand Character/utils +6 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/Character/Scene.tsx::Scene"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
