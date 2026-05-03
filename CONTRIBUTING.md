# Contributing to gstack-plus

Thanks for the interest. Two kinds of contributions are especially welcome at this stage:

## 1. Documentation fixes

Typos, broken links, unclear sentences in any `.md` under `docs/`, `classifier/`, `handoff/`, `verification/`, `experiments/`.

- Open a PR directly. Small docs PRs need no prior discussion.
- The site rebuilds automatically when `main` updates.

## 2. New experiment cases

If you have a real task that you ran through gstack-plus's classifier and the routing surprised you (good or bad), please file it under `experiments/` with:

- The task description
- The 5-dimension scoring you gave it
- What tier the rules picked
- What actually happened
- Why the result was surprising

This is the most valuable feedback we can get.

## What to *not* PR yet

- Large refactors of the framework — please open an issue first
- New skills/templates — discuss in an issue first
- Site redesigns — discuss in an issue first

## Local development

```bash
git clone https://github.com/zhewenzhang/gstack-plus
cd gstack-plus/site
npm install
npm run dev
```

Visit http://localhost:5173.

## Adding a new doc

1. Drop the `.md` in the appropriate folder (`docs/learning-notes/`, `experiments/`, etc.)
2. Add an entry to `site/src/content/manifest.ts` with `order`, `slug`, `title`, `source`, and (for `manual` only) `subgroup` + `description`.
3. `git push` — the GitHub Action redeploys the site.

## Code of Conduct

Be kind. Assume good intent. Explain your reasoning. That's it.
