---
name: gortex-1-dirs-titlelines
description: "Work in the . +1 dirs · titleLines area — 10 symbols across 2 files (78% cohesion)"
---

# . +1 dirs · titleLines

10 symbols | 2 files | 78% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/ArtPage.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | toLowerCase, toUpperCase |
| `src/components/ArtPage.tsx` | title, word, sentenceCase, s, titleLines, ... |

## Connected Communities

- **components +1 dirs · replace** (1 cross-edges)
- **components +5 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-17")
explore(operation:"context", task:"understand . +1 dirs · titleLines", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
