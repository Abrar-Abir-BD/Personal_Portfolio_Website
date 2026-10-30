---
name: gortex-1-dirs-mat
description: "Work in the . +1 dirs · mat area — 11 symbols across 2 files (88% cohesion)"
---

# . +1 dirs · mat

11 symbols | 2 files | 88% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `` | lstrip |
| `model-backup/restyle_character.py` | mat, m, bsdf_of, h, metal, ... |

## Connected Communities

- **. +1 dirs · hair_strand** (1 cross-edges)
- **. +1 dirs · bpy** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-5")
explore(operation:"context", task:"understand . +1 dirs · mat", format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
