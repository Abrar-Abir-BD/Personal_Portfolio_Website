---
name: gortex-1-dirs-hair-strand
description: "Work in the . +1 dirs · hair_strand area — 56 symbols across 2 files (88% cohesion)"
---

# . +1 dirs · hair_strand

56 symbols | 2 files | 88% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `` | seed, random, cos, sin, exp, ... |
| `model-backup/restyle_character.py` | ring, R, phase, hair_cap, az, ... |

## Entry Points

- `model-backup/restyle_character.py::beard`
- `model-backup/restyle_character.py::hair_waves`
- `model-backup/restyle_character.py::add_torus`
- `model-backup/restyle_character.py::hair_cap`
- `model-backup/restyle_character.py::hair_strand`

## Connected Communities

- **. +1 dirs · glasses_frame** (7 cross-edges)
- **. +1 dirs · add_sphere** (2 cross-edges)
- **. +1 dirs · bpy** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-4")
explore(operation:"context", task:"understand . +1 dirs · hair_strand", format:"gcx")
relations(operation:"usages", target:{symbol:"model-backup/restyle_character.py::beard"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
