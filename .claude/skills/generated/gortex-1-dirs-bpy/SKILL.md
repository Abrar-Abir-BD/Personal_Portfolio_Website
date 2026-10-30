---
name: gortex-1-dirs-bpy
description: "Work in the . +1 dirs · bpy area — 15 symbols across 3 files (78% cohesion)"
---

# . +1 dirs · bpy

15 symbols | 3 files | 78% cohesion

## When to Use

Use this skill when working on files in:
- `external-call::dep:mathutils.bvhtree.BVHTree`
- `external-call::stdlib:bpy`
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `external-call::dep:mathutils.bvhtree.BVHTree` | mathutils.bvhtree.BVHTree |
| `external-call::stdlib:bpy` | bpy |
| `model-backup/restyle_character.py` | name, name, fn, build, smooth, ... |

## Entry Points

- `model-backup/restyle_character.py::head_tree`

## Connected Communities

- **. +1 dirs · glasses_frame** (4 cross-edges)
- **. +1 dirs · hair_strand** (3 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-0")
explore(operation:"context", task:"understand . +1 dirs · bpy", format:"gcx")
relations(operation:"usages", target:{symbol:"model-backup/restyle_character.py::head_tree"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
