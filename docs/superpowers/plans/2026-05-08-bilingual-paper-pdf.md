# Bilingual Academic Paper PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate two academic-style PDFs about gstack+ — one English (with Chinese abstract) and one Chinese (with English abstract) — using Typst, then add download buttons to the deployed website.

**Architecture:** Claude installs Typst and prepares a rich GEMINI task file with all source content embedded. Gemini CLI writes the two complete `.typ` source files and compiles both PDFs. Qwen adds download UI to the website and deploys.

**Tech Stack:** Typst (typesetting), Gemini CLI (`gemini -y --skip-trust -p`), Qwen (`qwen -y`), Vite/React (website)

---

## File Map

| File | Agent | Action |
|------|-------|--------|
| `site/public/papers/gstack-plus-en.pdf` | Gemini | CREATE — English paper PDF |
| `site/public/papers/gstack-plus-zh.pdf` | Gemini | CREATE — Chinese paper PDF |
| `site/public/papers/paper-en.typ` | Gemini | CREATE — English Typst source |
| `site/public/papers/paper-zh.typ` | Gemini | CREATE — Chinese Typst source |
| `GEMINI_PAPER.md` | Claude | CREATE — Task file for Gemini |
| `site/src/pages/Results.tsx` | Qwen | MODIFY — Add download section |

---

## Task 1: Install Typst

**Files:** none (binary install)

- [ ] **Step 1: Install via winget**

```bash
winget install --id Typst.Typst -e --accept-source-agreements --accept-package-agreements
```

Expected output: `Successfully installed`

- [ ] **Step 2: Verify installation**

```bash
typst --version
```

Expected: `typst 0.x.x` (any version ≥ 0.11)

- [ ] **Step 3: Create output directory**

```bash
mkdir -p D:/gstack-plus/site/public/papers
```

---

## Task 2: Gather Content → Write GEMINI_PAPER.md

**Files:**
- Create: `D:\gstack-plus\GEMINI_PAPER.md`
- Read: `docs/key-findings.md`, `docs/architecture.md`, `docs/experiment-summary.md`, `docs/strategy.md`, `experiments/methodology.md`

Claude reads all source files and writes a single task file containing the full content + complete Typst template code + paper writing instructions. This file is intentionally large (~2,000–4,000 lines) because Gemini has a 1M-token context window.

- [ ] **Step 1: Read all source files** (Claude reads these 5 files in parallel)

- [ ] **Step 2: Write GEMINI_PAPER.md** with the following structure:

The file must contain:
1. **重要约束** section (scope prohibition)
2. **任务说明** (write EN + ZH Typst files, compile both)
3. **完整的 Typst 模板代码** (see template in Step 3)
4. **所有源文档内容**（embedded verbatim）
5. **验收标准** + commit/push steps

- [ ] **Step 3: Embed this Typst template as the starting point for both papers**

The base template for the English paper (`paper-en.typ`):

```typst
#set page(
  paper: "a4",
  margin: (left: 2.5cm, right: 2.5cm, top: 3cm, bottom: 3cm),
  numbering: "1",
)
#set text(
  font: ("Linux Libertine", "Noto Serif CJK SC", "SimSun", "Microsoft YaHei"),
  size: 11pt,
  lang: "en",
)
#set par(justify: true, leading: 0.75em)
#set heading(numbering: "1.1")

// ── Title block ──────────────────────────────────────────────
#align(center)[
  #pad(top: 1.5cm, bottom: 0.5cm)[
    #text(size: 18pt, weight: "bold")[
      gstack+: A Three-Tier LLM Orchestration Framework \
      for Cost-Efficient AI Development
    ]
  ]
  #text(size: 12pt)[Dave Zhang]
  #v(0.3cm)
  #text(size: 10pt, fill: gray)[2026 · Technical Report]
]

#v(0.8cm)
#line(length: 100%, stroke: 0.5pt)

// ── Chinese Abstract ─────────────────────────────────────────
#pad(x: 1cm)[
  #text(weight: "bold")[摘要（Chinese Abstract）]
  #v(0.3cm)
  #set text(size: 10pt)
  [Chinese abstract content here — 150–200 characters]
]

#line(length: 100%, stroke: 0.5pt)
#v(0.5cm)

// ── Body ─────────────────────────────────────────────────────
= Introduction
...
```

The base template for the Chinese paper (`paper-zh.typ`) uses the same structure but:
- `lang: "zh"` instead of `lang: "en"`
- Chinese title + Chinese body
- English Abstract section at the top instead of Chinese Abstract

---

## Task 3: Dispatch to Gemini — Write Both Papers + Compile

**Files:**
- Create: `site/public/papers/paper-en.typ`
- Create: `site/public/papers/paper-zh.typ`
- Create: `site/public/papers/gstack-plus-en.pdf`
- Create: `site/public/papers/gstack-plus-zh.pdf`

- [ ] **Step 1: Dispatch**

```bash
cd D:/gstack-plus && gemini -y --skip-trust -p "请阅读并严格执行 D:/gstack-plus/GEMINI_PAPER.md 文件中的所有指令，完成后输出验收结果"
```

Timeout: 10 minutes. Gemini will:
1. Read GEMINI_PAPER.md
2. Write `site/public/papers/paper-en.typ` (complete English paper)
3. Write `site/public/papers/paper-zh.typ` (complete Chinese paper)
4. Run `typst compile site/public/papers/paper-en.typ`
5. Run `typst compile site/public/papers/paper-zh.typ`

- [ ] **Step 2: Verify PDFs exist**

```bash
ls -la D:/gstack-plus/site/public/papers/
```

Expected: both `.pdf` files present, each ≥ 100KB

---

## Task 4: Claude Verification

**Files:** read-only

- [ ] **Step 1: Check PDF file sizes**

```bash
ls -lh D:/gstack-plus/site/public/papers/*.pdf
```

Each PDF must be > 50KB (a 6+ page document). If < 50KB, Gemini likely produced a stub — re-run Task 3.

- [ ] **Step 2: Check .typ source line counts**

```bash
wc -l D:/gstack-plus/site/public/papers/*.typ 2>/dev/null || (Get-Content D:/gstack-plus/site/public/papers/paper-en.typ).Count
```

Each `.typ` file must be > 300 lines (a real paper, not a stub).

- [ ] **Step 3: Spot-check content**

```bash
grep -c "=" D:/gstack-plus/site/public/papers/paper-en.typ
```

Should show ≥ 8 section headings (`=` in Typst = heading).

---

## Task 5: Qwen Adds Download UI + Deploy

**Files:**
- Modify: `site/src/pages/Results.tsx`
- Create: `QWEN_PAPER_DOWNLOAD_UI.md`

- [ ] **Step 1: Claude writes Qwen task file**

Create `QWEN_PAPER_DOWNLOAD_UI.md` with this exact replacement for `Results.tsx`:

Find the hero stats section near the top of Results.tsx (the `<div>` containing the `−46%` stat card), and **prepend** a download section just before the `<main>` tag or just after the first `</section>` closing tag.

The new JSX block to insert (exact `old_string` → `new_string` replacement to be determined when Claude reads the current Results.tsx):

```tsx
{/* Paper Download Section */}
<section className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 pb-2">
  <div className="border border-neutral-200 dark:border-[#2A2A2A] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <div className="font-display text-lg text-ink mb-1">
        {lang === 'zh' ? '技術論文下載' : 'Technical Paper'}
      </div>
      <div className="text-sm text-muted">
        {lang === 'zh'
          ? '完整實驗方法論與系統設計報告（學術格式 PDF）'
          : 'Full experimental methodology and system design report (academic PDF)'}
      </div>
    </div>
    <div className="flex gap-3 flex-shrink-0">
      <a
        href="/gstack-plus/papers/gstack-plus-en.pdf"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-neutral-300 dark:border-[#383838] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4v-2h14v2H5z"/></svg>
        EN Paper
      </a>
      <a
        href="/gstack-plus/papers/gstack-plus-zh.pdf"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-ink text-white dark:text-black hover:opacity-90 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4v-2h14v2H5z"/></svg>
        中文論文
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Dispatch to Qwen**

```bash
cd D:/gstack-plus && qwen -y "请阅读并严格执行 D:/gstack-plus/QWEN_PAPER_DOWNLOAD_UI.md 文件中的所有指令，完成后输出验收结果"
```

- [ ] **Step 3: Verify push**

```bash
git log --oneline -3
```

Expected: commit containing "feat(results): add paper download section"

---

## Acceptance Criteria

- [ ] `site/public/papers/gstack-plus-en.pdf` ≥ 50KB
- [ ] `site/public/papers/gstack-plus-zh.pdf` ≥ 50KB  
- [ ] `paper-en.typ` has Chinese abstract section
- [ ] `paper-zh.typ` has English abstract section
- [ ] Both `.typ` files have ≥ 8 section headings
- [ ] Download section visible on Results page after deploy
- [ ] Links point to `/gstack-plus/papers/gstack-plus-{en,zh}.pdf` (GitHub Pages base path)
