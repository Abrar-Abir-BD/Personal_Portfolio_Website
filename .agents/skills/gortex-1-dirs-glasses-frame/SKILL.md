---
name: gortex-1-dirs-glasses-frame
description: "Work in the . +1 dirs · glasses_frame area — 34 symbols across 4 files (77% cohesion)"
---

# . +1 dirs · glasses_frame

34 symbols | 4 files | 77% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `external-call::dep:mathutils.Vector`
- `external-call::stdlib:bmesh`
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `` | copysign |
| `external-call::dep:mathutils.Vector` | mathutils.Vector |
| `external-call::stdlib:bmesh` | bmesh |
| `model-backup/restyle_character.py` | bbox, s, add_box, p, bm, ... |

## Entry Points

- `model-backup/restyle_character.py::glasses_frame`
- `model-backup/restyle_character.py::hoodie`
- `model-backup/restyle_character.py::glasses_lens`
- `model-backup/restyle_character.py::glasses_studs`
- `model-backup/restyle_character.py::pocket`

## Connected Communities

- **. +1 dirs · hair_strand** (8 cross-edges)
- **. +1 dirs · add_sphere** (2 cross-edges)
- **model-backup · P** (2 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-2")
explore(operation:"context", task:"understand . +1 dirs · glasses_frame", format:"gcx")
relations(operation:"usages", target:{symbol:"model-backup/restyle_character.py::glasses_frame"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
