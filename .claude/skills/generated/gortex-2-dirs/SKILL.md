---
name: gortex-2-dirs
description: "Work in the . +2 dirs area — 14 symbols across 3 files (66% cohesion)"
---

# . +2 dirs

14 symbols | 3 files | 66% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/CertificatesPage.tsx`
- `src/data/portfolioContent.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | indexOf, findIndex |
| `src/components/CertificatesPage.tsx` | current, show, onKey, open, name, ... |
| `src/data/portfolioContent.ts` | cert, certificateSlug, Certificate |

## Entry Points

- `src/components/CertificatesPage.tsx::CertificatesPage`

## Connected Communities

- **components +1 dirs · map** (4 cross-edges)
- **Character/utils +6 dirs** (2 cross-edges)
- **components +5 dirs** (1 cross-edges)
- **components +2 dirs** (1 cross-edges)
- **components +1 dirs · replace** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-19")
explore(operation:"context", task:"understand . +2 dirs", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/CertificatesPage.tsx::CertificatesPage"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
