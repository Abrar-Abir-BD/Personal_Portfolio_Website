---
name: gortex-components-2-dirs
description: "Work in the components +2 dirs area — 10 symbols across 4 files (75% cohesion)"
---

# components +2 dirs

10 symbols | 4 files | 75% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Experience.tsx`
- `src/components/Research.tsx`
- `src/components/utils/flags.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | pop, trim |
| `src/components/Experience.tsx` | Place, Flag, country |
| `src/components/Research.tsx` | Place, country, Flag |
| `src/components/utils/flags.ts` | countryOf, location |

## Connected Communities

- **components +5 dirs** (1 cross-edges)
- **components +1 dirs · replace** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-27")
explore(operation:"context", task:"understand components +2 dirs", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
