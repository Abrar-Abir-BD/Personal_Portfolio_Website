---
name: gortex-1-dirs-add-sphere
description: "Work in the . +1 dirs · add_sphere area — 27 symbols across 2 files (82% cohesion)"
---

# . +1 dirs · add_sphere

27 symbols | 2 files | 82% cohesion

## When to Use

Use this skill when working on files in:
- `external-call::dep:mathutils.Matrix`
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `external-call::dep:mathutils.Matrix` | mathutils.Matrix |
| `model-backup/restyle_character.py` | loc, axis, r, M, bm, ... |

## Entry Points

- `model-backup/restyle_character.py::facial_hair`

## Connected Communities

- **. +1 dirs · glasses_frame** (1 cross-edges)
- **. +1 dirs · hair_strand** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-1")
explore(operation:"context", task:"understand . +1 dirs · add_sphere", format:"gcx")
relations(operation:"usages", target:{symbol:"model-backup/restyle_character.py::facial_hair"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
