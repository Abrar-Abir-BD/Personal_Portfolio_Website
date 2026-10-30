---
name: gortex-model-backup-p
description: "Work in the model-backup · P area — 15 symbols across 1 files (80% cohesion)"
---

# model-backup · P

15 symbols | 1 files | 80% cohesion

## When to Use

Use this skill when working on files in:
- `model-backup/restyle_character.py`

## Key Files

| File | Symbols |
|------|---------|
| `model-backup/restyle_character.py` | bm, add_cyl, robot_dark, a, segs, ... |

## Entry Points

- `model-backup/restyle_character.py::robot_white`
- `model-backup/restyle_character.py::robot_dark`

## Connected Communities

- **. +1 dirs · glasses_frame** (6 cross-edges)
- **. +1 dirs · add_sphere** (5 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-6")
explore(operation:"context", task:"understand model-backup · P", format:"gcx")
relations(operation:"usages", target:{symbol:"model-backup/restyle_character.py::robot_white"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
