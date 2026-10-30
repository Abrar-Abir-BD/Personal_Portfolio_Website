---
name: gortex-character-utils-1-dirs
description: "Work in the Character/utils +1 dirs area — 23 symbols across 3 files (86% cohesion)"
---

# Character/utils +1 dirs

23 symbols | 3 files | 86% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Character/utils/animationUtils.ts`
- `src/components/Character/utils/character.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | error, includes, some |
| `src/components/Character/utils/animationUtils.ts` | gltf, mixer, boneNames, filteredTracks, AnimationClip, ... |
| `src/components/Character/utils/character.ts` | loadCharacter |

## Entry Points

- `src/components/Character/utils/character.ts::loadCharacter`

## Connected Communities

- **components +1 dirs · map** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **components +5 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-21")
explore(operation:"context", task:"understand Character/utils +1 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/Character/utils/character.ts::loadCharacter"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
