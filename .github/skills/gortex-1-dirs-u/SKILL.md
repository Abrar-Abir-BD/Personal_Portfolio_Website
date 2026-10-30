---
name: gortex-1-dirs-u
description: "Work in the . +1 dirs · u area — 56 symbols across 2 files (100% cohesion)"
---

# . +1 dirs · u

56 symbols | 2 files | 100% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `public/draco/draco_wasm_wrapper.js`

## Key Files

| File | Symbols |
|------|---------|
| `` | unshift, then, pop, catch, charCodeAt, ... |
| `public/draco/draco_wasm_wrapper.js` | y, b, S, v, z, ... |

## Entry Points

- `public/draco/draco_wasm_wrapper.js::b_L114`
- `public/draco/draco_wasm_wrapper.js::D`
- `public/draco/draco_wasm_wrapper.js::C`
- `public/draco/draco_wasm_wrapper.js::f_L24`
- `public/draco/draco_wasm_wrapper.js::u_L25`

## How to Explore

```
analyze(operation:"communities", id:"community-13")
explore(operation:"context", task:"understand . +1 dirs · u", format:"gcx")
relations(operation:"usages", target:{symbol:"public/draco/draco_wasm_wrapper.js::b_L114"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
