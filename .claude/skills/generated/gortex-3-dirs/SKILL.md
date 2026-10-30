---
name: gortex-3-dirs
description: "Work in the . +3 dirs area — 20 symbols across 4 files (76% cohesion)"
---

# . +3 dirs

20 symbols | 4 files | 76% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Character/utils/animationUtils.ts`
- `src/components/Media.tsx`
- `src/components/utils/useSlider.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | reverse, find |
| `src/components/Character/utils/animationUtils.ts` | startIntro, introAction, introClip |
| `src/components/Media.tsx` | Media, update, slide, track, atStart, ... |
| `src/components/utils/useSlider.ts` | now, pos, pad, max, starts, ... |

## Entry Points

- `src/components/Media.tsx::Media`
- `src/components/Character/utils/animationUtils.ts::startIntro`

## Connected Communities

- **components +5 dirs** (3 cross-edges)
- **components/utils** (1 cross-edges)
- **components +1 dirs · map** (1 cross-edges)
- **components +1 dirs · replace** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-28")
explore(operation:"context", task:"understand . +3 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/Media.tsx::Media"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
