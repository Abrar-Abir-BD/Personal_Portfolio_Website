---
name: gortex-components-1-dirs-awardcard
description: "Work in the components +1 dirs · AwardCard area — 18 symbols across 2 files (76% cohesion)"
---

# components +1 dirs · AwardCard

18 symbols | 2 files | 76% cohesion

## When to Use

Use this skill when working on files in:
- `src/components/Awards.tsx`
- `src/data/portfolioContent.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/components/Awards.tsx` | descRef, country, award, setClamped, Flag, ... |
| `src/data/portfolioContent.ts` | Experience, Publication, Project, ProjectLink, Award |

## Entry Points

- `src/components/Awards.tsx::AwardCard`

## Connected Communities

- **Character/utils +6 dirs** (3 cross-edges)
- **components +1 dirs · map** (2 cross-edges)
- **components +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-18")
explore(operation:"context", task:"understand components +1 dirs · AwardCard", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/Awards.tsx::AwardCard"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
