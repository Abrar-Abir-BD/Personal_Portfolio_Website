---
name: gortex-character-utils-2-dirs
description: "Work in the Character/utils +2 dirs area — 18 symbols across 4 files (89% cohesion)"
---

# Character/utils +2 dirs

18 symbols | 4 files | 89% cohesion

## When to Use

Use this skill when working on files in:
- `src/components/Character/Scene.tsx`
- `src/components/Character/utils/lighting.ts`
- `src/components/Character/utils/mouseUtils.ts`
- `src/router.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/components/Character/Scene.tsx` | delta, msPerFrame, animate, delta, checkPerformance |
| `src/components/Character/utils/lighting.ts` | screenLight, setPointLight |
| `src/components/Character/utils/mouseUtils.ts` | maxRotation, maxRotationX, lerp, headBone, mouseY, ... |
| `src/router.ts` | isAway |

## Connected Communities

- **components/utils** (1 cross-edges)
- **components +5 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-31")
explore(operation:"context", task:"understand Character/utils +2 dirs", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
