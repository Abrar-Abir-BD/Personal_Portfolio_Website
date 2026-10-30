---
name: gortex-src-3-dirs
description: "Work in the src +3 dirs area — 27 symbols across 5 files (83% cohesion)"
---

# src +3 dirs

27 symbols | 5 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/App.tsx`
- `src/components/Character/index.tsx`
- `src/context/LoadingProvider.tsx`
- `src/router.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | focus |
| `src/App.tsx` | App, layer, main, setMainShown, loadArtPage, ... |
| `src/components/Character/index.tsx` | CharacterModel |
| `src/context/LoadingProvider.tsx` | started, leaving, LoadingContext, finishLoading, isLoading, ... |
| `src/router.ts` | jump, value, setAway |

## Entry Points

- `src/App.tsx::App`
- `src/context/LoadingProvider.tsx::LoadingProvider`
- `src/App.tsx::Subpage`

## Connected Communities

- **. +1 dirs · delete** (1 cross-edges)
- **. +1 dirs · parseRoute** (1 cross-edges)
- **Character/utils +6 dirs** (1 cross-edges)
- **components +5 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-14")
explore(operation:"context", task:"understand src +3 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/App.tsx::App"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
