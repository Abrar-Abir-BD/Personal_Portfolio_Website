---
name: gortex-components-1-dirs-map
description: "Work in the components +1 dirs · map area — 60 symbols across 13 files (80% cohesion)"
---

# components +1 dirs · map

60 symbols | 13 files | 80% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/ArtPage.tsx`
- `src/components/ArtPortfolio.tsx`
- `src/components/Awards.tsx`
- `src/components/Certificates.tsx`
- `src/components/Experience.tsx`
- `src/components/Glass.tsx`
- `src/components/Landing.tsx`
- `src/components/Moments.tsx`
- `src/components/ProjectPage.tsx`
- `src/components/Projects.tsx`
- `src/components/Research.tsx`
- `src/components/Skills.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | padStart, map, filter, slice |
| `src/components/ArtPage.tsx` | pics, Picture, first, Caption, cls, ... |
| `src/components/ArtPortfolio.tsx` | ArtPortfolio |
| `src/components/Awards.tsx` | shown, expanded, Awards, toggle, setExpanded |
| `src/components/Certificates.tsx` | Certificates |
| `src/components/Experience.tsx` | toggle, Logo, expanded, shown, Experience, ... |
| `src/components/Glass.tsx` | GlassImage, e, rect, el, GlassCard, ... |
| `src/components/Landing.tsx` | toLines, renderLines, best, i, diff, ... |
| `src/components/Moments.tsx` | Moments |
| `src/components/ProjectPage.tsx` | ProjectPage, name, metaOf, parts, project |
| `src/components/Projects.tsx` | shown, expanded, toggle, project, Projects, ... |
| `src/components/Research.tsx` | Research |
| `src/components/Skills.tsx` | Skills |

## Entry Points

- `src/components/Projects.tsx::Projects`
- `src/components/ProjectPage.tsx::ProjectPage`
- `src/components/ArtPage.tsx::Caption`
- `src/components/ArtPortfolio.tsx::ArtPortfolio`
- `src/components/Experience.tsx::Experience`

## Connected Communities

- **components +5 dirs** (4 cross-edges)
- **. +1 dirs · titleLines** (2 cross-edges)
- **components +1 dirs · replace** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **. +2 dirs** (1 cross-edges)

## How to Explore

```
analyze(operation:"communities", id:"community-16")
explore(operation:"context", task:"understand components +1 dirs · map", format:"gcx")
relations(operation:"usages", target:{symbol:"src/components/Projects.tsx::Projects"}, format:"gcx")
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
