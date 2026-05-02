# Qwen Code 任務：建立 gstack-plus 文檔網站並部署到 GitHub Pages

> **工作目錄**：`D:\gstack-plus`
> **新增子目錄**：`D:\gstack-plus\site\`（所有網站代碼放這裡，不污染原有結構）
> **目標**：用 Cinematic Hero 風格做一個 React + Vite + TS + Tailwind 文檔站，把所有學習筆記與開發手冊分類陳列，並部署到 GitHub Pages，未來新增 markdown 即可自動上線。

---

## 一、任務目標（一句話）

把 `D:\gstack-plus` 內既有的所有 markdown 文件（學習筆記 + Phase 1/2 開發手冊 + 實驗記錄 + 戰略筆記）以指定的 cinematic 視覺風格組裝成可部署的靜態網站，部署到 GitHub Pages，並建立「新增 .md 檔 → push → 自動上線」的工作流程。

---

## 二、技術棧（不要替換）

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS**
- **react-router-dom** v6（hash router，方便 GitHub Pages）
- **react-markdown** + **remark-gfm** + **rehype-slug** + **rehype-autolink-headings**
- **gray-matter**（讀 frontmatter）
- **gh-pages**（部署）+ **GitHub Actions**（auto deploy）

---

## 三、內容分類與排序（**核心需求，照此實作**）

依下列六大區塊建立 `site/src/content/manifest.ts`，每篇文章一個物件 `{ slug, title, category, order, source }`，`source` 為來源 .md 的相對路徑（從 repo root）。網站側邊欄按 `order` 由小到大排，分組按 category 顯示。

```ts
// site/src/content/manifest.ts 應產生此資料
export const NAV: Section[] = [
  {
    id: "overview",
    title: "概覽",
    items: [
      { order: 101, slug: "roadmap", title: "項目路線圖", source: "PROJECT_ROADMAP.md" },
      { order: 102, slug: "key-insights", title: "核心洞察", source: "docs/learning-notes/key-insights.md" },
      { order: 103, slug: "learning-plan", title: "學習計劃", source: "LEARNING_PLAN.md" },
      { order: 104, slug: "readme", title: "README", source: "README.md" },
    ],
  },
  {
    id: "learning-notes",
    title: "學習筆記",
    items: [
      { order: 201, slug: "gstack-overview", title: "gstack：系統概覽", source: "docs/learning-notes/gstack-overview.md" },
      { order: 202, slug: "gstack-planning", title: "gstack：規劃技能", source: "docs/learning-notes/gstack-planning-skills.md" },
      { order: 203, slug: "gstack-review", title: "gstack：審查技能", source: "docs/learning-notes/gstack-review-skills.md" },
      { order: 204, slug: "gstack-shipping", title: "gstack：出貨技能", source: "docs/learning-notes/gstack-shipping-skills.md" },
      { order: 205, slug: "gstack-anatomy", title: "gstack：結構解剖", source: "docs/learning-notes/gstack-anatomy.md" },
      { order: 211, slug: "superpowers-anatomy", title: "superpowers：結構解剖", source: "docs/learning-notes/superpowers-anatomy.md" },
      { order: 212, slug: "superpowers-planning", title: "superpowers：規劃技能", source: "docs/learning-notes/superpowers-planning.md" },
      { order: 213, slug: "superpowers-quality", title: "superpowers：品質技能", source: "docs/learning-notes/superpowers-quality.md" },
      { order: 214, slug: "superpowers-parallel", title: "superpowers：並行技能", source: "docs/learning-notes/superpowers-parallel.md" },
      { order: 220, slug: "gstack-vs-superpowers", title: "gstack vs superpowers", source: "docs/learning-notes/gstack-vs-superpowers.md" },
    ],
  },
  {
    id: "manual",
    title: "開發手冊",
    items: [
      { order: 301, slug: "architecture", title: "三層架構設計", source: "docs/architecture.md" },
      { order: 311, slug: "scoring-guide", title: "分類器：評分指南", source: "classifier/scoring-guide.md" },
      { order: 312, slug: "routing-rules", title: "分類器：路由規則", source: "classifier/routing-rules.md" },
      { order: 313, slug: "test-tasks", title: "分類器：測試任務集", source: "classifier/test-tasks.md" },
      { order: 321, slug: "plan-to-exec", title: "交接：Plan → Exec", source: "handoff/templates/plan-to-exec.md" },
      { order: 322, slug: "exec-to-check", title: "交接：Exec → Check", source: "handoff/templates/exec-to-check.md" },
      { order: 323, slug: "check-to-plan", title: "交接：Check → Plan", source: "handoff/templates/check-to-plan.md" },
      { order: 324, slug: "evidence-format", title: "交接：Evidence 格式", source: "handoff/templates/shared/evidence-format.md" },
      { order: 325, slug: "forbidden-words", title: "交接：禁用詞表", source: "handoff/templates/shared/forbidden-words.md" },
      { order: 331, slug: "pre-flight", title: "失敗恢復：起飛前檢查清單", source: "verification/pre-flight-checklist.md" },
      { order: 332, slug: "failure-catalog", title: "失敗恢復：失敗類型目錄", source: "verification/failure-catalog.md" },
      { order: 333, slug: "failure-routing", title: "失敗恢復：失敗路由", source: "verification/failure-routing.md" },
      { order: 341, slug: "superpowers-integration", title: "Superpowers 整合", source: "docs/superpowers-integration.md" },
    ],
  },
  {
    id: "experiments",
    title: "實驗記錄",
    items: [
      { order: 401, slug: "experiments-readme", title: "實驗概述", source: "experiments/README.md" },
      { order: 402, slug: "methodology", title: "方法論", source: "experiments/methodology.md" },
      { order: 403, slug: "task-definitions", title: "任務定義", source: "experiments/task-definitions.md" },
      { order: 404, slug: "failure-scenarios", title: "失敗場景測試", source: "experiments/failure-scenarios.md" },
      { order: 405, slug: "results-report", title: "結果報告", source: "experiments/results-report.md" },
    ],
  },
  {
    id: "strategy",
    title: "戰略思考",
    items: [
      { order: 501, slug: "yc-blindspots", title: "YC 盲點清單", source: "YC_BLINDSPOTS.md" },
    ],
  },
];
```

> **注意**：`Section` 與 `Item` 的 type 也要在同檔案 export。`source` 都是相對 `D:\gstack-plus` 的路徑。

---

## 四、目錄結構（最終結果）

```
D:\gstack-plus\
├── site\                              ← 新增整個子目錄
│   ├── public\
│   ├── src\
│   │   ├── content\
│   │   │   ├── manifest.ts            ← 上面那份
│   │   │   └── loader.ts              ← 用 import.meta.glob 載入所有 .md
│   │   ├── components\
│   │   │   ├── Nav.tsx                ← 頂部導航
│   │   │   ├── Hero.tsx               ← Cinematic hero（首頁用）
│   │   │   ├── DocsLayout.tsx         ← 左側欄 + 內容區
│   │   │   ├── Sidebar.tsx
│   │   │   └── Markdown.tsx           ← react-markdown 包裝
│   │   ├── pages\
│   │   │   ├── Home.tsx               ← 用 Hero
│   │   │   └── DocPage.tsx            ← 動態文章頁
│   │   ├── styles\
│   │   │   ├── fonts.css
│   │   │   ├── theme.css
│   │   │   └── markdown.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── routes.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
└── .github\workflows\deploy-docs.yml  ← 新增
```

---

## 五、執行步驟

### Step 1：初始化 Vite 專案

在 `D:\gstack-plus\site\` 執行：

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom react-markdown remark-gfm rehype-slug rehype-autolink-headings gray-matter
npm install -D gh-pages @types/node
```

### Step 2：`site/vite.config.ts`

base 用空字串以避免 Pages 子路徑問題（搭配 HashRouter）。同時放開對上層目錄 `..` 的存取，讓 `import.meta.glob` 能讀 repo 根的 .md。

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
});
```

### Step 3：`site/tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: '#000000',
        muted: '#6F6F6F',
        background: '#FFFFFF',
      },
      animation: {
        'fade-rise': 'fadeRise 0.8s ease-out both',
        'fade-rise-delay': 'fadeRise 0.8s ease-out 0.2s both',
        'fade-rise-delay-2': 'fadeRise 0.8s ease-out 0.4s both',
      },
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Step 4：`site/src/styles/fonts.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
```

### Step 5：`site/src/styles/theme.css`（含 Hero 動畫，冗餘保留以防 tailwind 變更）

```css
@keyframes fadeRise {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-rise        { animation: fadeRise 0.8s ease-out both; }
.animate-fade-rise-delay  { animation: fadeRise 0.8s ease-out 0.2s both; }
.animate-fade-rise-delay-2{ animation: fadeRise 0.8s ease-out 0.4s both; }
```

### Step 6：`site/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/fonts.css';
import './styles/theme.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
```

### Step 7：`site/src/index.css`（Tailwind 入口）

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body {
  font-family: 'Inter', sans-serif;
  background: #FFFFFF;
  color: #000000;
}
```

### Step 8：`site/src/content/loader.ts`

用 `import.meta.glob` 預先把 repo 內所有 .md 抓進 bundle（raw 字串），鍵 = 來源路徑，值 = 內容。

```ts
const files = import.meta.glob('../../../**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadMarkdown(source: string): string | null {
  // 把 manifest 的 "PROJECT_ROADMAP.md" 之類路徑對齊到 glob 鍵
  const target = `../../../${source.replace(/\\/g, '/')}`;
  return files[target] ?? null;
}
```

> 若 vite glob 不支援 `'?raw' + eager + import: default'` 組合，改用：
>
> ```ts
> const files = import.meta.glob('../../../**/*.md', { as: 'raw', eager: true });
> ```
>
> （不同 vite 版本兩種寫法擇一即可，能跑就行）

### Step 9：`site/src/components/Nav.tsx`（**完全照原 prompt 規格實作**）

```tsx
import { Link, NavLink } from 'react-router-dom';

const items = [
  { label: 'Home',     to: '/',          active: true  },
  { label: 'Manual',   to: '/doc/architecture' },
  { label: 'Notes',    to: '/doc/gstack-overview' },
  { label: 'Experiments', to: '/doc/experiments-readme' },
  { label: 'Strategy', to: '/doc/yc-blindspots' },
];

export default function Nav() {
  return (
    <nav className="relative z-10 max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
      <Link to="/" className="font-display text-3xl tracking-tight text-ink">
        gstack<sup className="text-xl">+</sup>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {items.map(i => (
          <NavLink
            key={i.label}
            to={i.to}
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive || i.active ? 'text-ink' : 'text-muted hover:text-ink'}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </div>
      <Link
        to="/doc/roadmap"
        className="rounded-full px-6 py-2.5 text-sm bg-ink text-white transition-transform hover:scale-[1.03]"
      >
        Begin Journey
      </Link>
    </nav>
  );
}
```

### Step 10：`site/src/components/Hero.tsx`（**完全照用戶原 prompt 視覺規格，文案改寫如下**）

```tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; v.playsInline = true; v.autoplay = true;
    v.play().catch(() => {});
    const tick = () => {
      if (!v.duration || isNaN(v.duration)) {
        rafRef.current = requestAnimationFrame(tick); return;
      }
      const t = v.currentTime, d = v.duration;
      let opacity = 1;
      if (t < 0.5) opacity = t / 0.5;
      else if (t > d - 0.5) opacity = Math.max(0, (d - t) / 0.5);
      v.style.opacity = String(opacity);
      rafRef.current = requestAnimationFrame(tick);
    };
    const onEnded = () => {
      v.style.opacity = '0';
      setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); }, 100);
    };
    v.addEventListener('ended', onEnded);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <section className="relative" style={{ paddingTop: 'calc(8rem - 75px)', paddingBottom: '10rem' }}>
      {/* video layer */}
      <div className="absolute z-0" style={{ top: '300px', inset: 'auto 0 0 0' }}>
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="w-full h-auto"
          style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px', color: '#000000' }}
        >
          Beyond <em className="italic" style={{ color: '#6F6F6F' }}>silos,</em> we orchestrate{' '}
          <em className="italic" style={{ color: '#6F6F6F' }}>the eternal.</em>
        </h1>

        <p
          className="font-body text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
          style={{ color: '#6F6F6F' }}
        >
          A multi-tier model orchestration framework for brilliant minds, fearless makers, and
          thoughtful souls. Through the noise of single-model thinking, we craft tiered systems
          for deep judgment and pure execution.
        </p>

        <Link
          to="/doc/roadmap"
          className="rounded-full px-14 py-5 text-base mt-12 bg-ink text-white transition-transform hover:scale-[1.03] animate-fade-rise-delay-2"
        >
          Begin Journey
        </Link>
      </div>
    </section>
  );
}
```

### Step 11：`site/src/pages/Home.tsx`

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Nav />
      <Hero />
    </div>
  );
}
```

### Step 12：`site/src/components/Sidebar.tsx`

```tsx
import { NavLink } from 'react-router-dom';
import { NAV } from '@/content/manifest';

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-neutral-200 px-6 py-10 sticky top-0 h-screen overflow-y-auto">
      {NAV.map(section => (
        <div key={section.id} className="mb-8">
          <div className="font-display text-xl text-ink mb-3">{section.title}</div>
          <ul className="space-y-1.5">
            {section.items
              .slice()
              .sort((a, b) => a.order - b.order)
              .map(item => (
                <li key={item.slug}>
                  <NavLink
                    to={`/doc/${item.slug}`}
                    className={({ isActive }) =>
                      `block text-sm transition-colors ${isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
```

### Step 13：`site/src/components/Markdown.tsx`

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import '@/styles/markdown.css';

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
```

### Step 14：`site/src/styles/markdown.css`（保持與 Hero 同一字體系統）

```css
.markdown-body { font-family: 'Inter', sans-serif; color: #1f1f1f; line-height: 1.75; max-width: 760px; }
.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
  font-family: 'Instrument Serif', serif; color: #000000; letter-spacing: -0.5px; margin-top: 2.2rem; margin-bottom: 0.8rem;
}
.markdown-body h1 { font-size: 2.6rem; line-height: 1.1; }
.markdown-body h2 { font-size: 2rem; line-height: 1.15; }
.markdown-body h3 { font-size: 1.5rem; }
.markdown-body p  { margin: 0.9rem 0; color: #2a2a2a; }
.markdown-body a  { color: #000; text-decoration: underline; text-underline-offset: 3px; }
.markdown-body code { background: #f4f4f4; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
.markdown-body pre  { background: #0b0b0b; color: #f5f5f5; padding: 1rem 1.2rem; border-radius: 10px; overflow-x: auto; font-size: 0.88rem; }
.markdown-body pre code { background: transparent; padding: 0; color: inherit; }
.markdown-body blockquote { border-left: 3px solid #000; padding-left: 1rem; color: #555; margin: 1.2rem 0; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 1.2rem 0; }
.markdown-body th, .markdown-body td { border: 1px solid #e5e5e5; padding: 0.55rem 0.8rem; text-align: left; font-size: 0.92rem; }
.markdown-body th { background: #fafafa; }
.markdown-body ul, .markdown-body ol { padding-left: 1.4rem; }
.markdown-body li { margin: 0.3rem 0; }
.markdown-body hr { border: 0; border-top: 1px solid #eaeaea; margin: 2rem 0; }
```

### Step 15：`site/src/pages/DocPage.tsx`

```tsx
import { useParams, Link } from 'react-router-dom';
import { NAV } from '@/content/manifest';
import { loadMarkdown } from '@/content/loader';
import Sidebar from '@/components/Sidebar';
import Markdown from '@/components/Markdown';

export default function DocPage() {
  const { slug } = useParams();
  const item = NAV.flatMap(s => s.items).find(i => i.slug === slug);
  if (!item) {
    return (
      <div className="p-12">
        <p className="text-muted">找不到這篇文章。</p>
        <Link className="underline" to="/">回首頁</Link>
      </div>
    );
  }
  const md = loadMarkdown(item.source);
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-10 py-12">
        <div className="mb-6">
          <Link to="/" className="font-display text-2xl">gstack<sup>+</sup></Link>
        </div>
        <h1 className="font-display text-4xl mb-2">{item.title}</h1>
        <p className="text-xs text-muted mb-8">來源：<code>{item.source}</code></p>
        {md ? <Markdown source={md} /> : <p className="text-muted">Markdown 尚未載入。</p>}
      </main>
    </div>
  );
}
```

### Step 16：`site/src/App.tsx` 與 `site/src/routes.tsx`

```tsx
// routes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocPage from './pages/DocPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doc/:slug" element={<DocPage />} />
    </Routes>
  );
}

// App.tsx
import AppRoutes from './routes';
export default function App() { return <AppRoutes />; }
```

### Step 17：本地驗證

```bash
cd D:\gstack-plus\site
npm run dev
```

開瀏覽器到顯示的 localhost 端口，**逐項驗證**：
1. 首頁 Hero 動畫正常、影片有淡入淡出、CTA 可點
2. 點 Begin Journey 跳到 `/doc/roadmap`，能讀到 `PROJECT_ROADMAP.md` 內容
3. 側邊欄顯示 5 個分類，每篇點進去都能正常 render
4. 隨機抽 5 篇驗證內容正確（不是空的）

---

## 六、GitHub 倉庫初始化與部署

### Step 18：建立遠端倉庫

> **此步驟需要由用戶在瀏覽器或本機執行，請在指令完成前向用戶提示**：
> 1. 在 GitHub 建立空倉庫 `gstack-plus`（public）
> 2. 在 `D:\gstack-plus` 執行：
>    ```bash
>    git remote add origin https://github.com/<USER>/gstack-plus.git
>    git branch -M main
>    git add . && git commit -m "feat: docs site"
>    git push -u origin main
>    ```

### Step 19：`.github/workflows/deploy-docs.yml`

在 `D:\gstack-plus\.github\workflows\deploy-docs.yml` 新增：

```yaml
name: Deploy Docs Site

on:
  push:
    branches: [main]
    paths:
      - 'site/**'
      - 'docs/**'
      - 'classifier/**'
      - 'handoff/**'
      - 'verification/**'
      - 'experiments/**'
      - 'PROJECT_ROADMAP.md'
      - 'YC_BLINDSPOTS.md'
      - 'README.md'
      - 'LEARNING_PLAN.md'
      - '.github/workflows/deploy-docs.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: 'site/package-lock.json' }
      - run: npm ci
        working-directory: site
      - run: npm run build
        working-directory: site
      - uses: actions/upload-pages-artifact@v3
        with: { path: site/dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> 用戶推到 main 後，需在 GitHub 倉庫 → Settings → Pages → Source 選 **GitHub Actions**。

### Step 20：`site/package.json` 確認 build 腳本

確認存在：
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

---

## 七、未來新增文章的工作流程（**寫進 site/README.md**）

新增 `site/README.md`，內容：

```markdown
# gstack-plus 文檔網站

## 新增一篇文章

1. 把 .md 檔放進對應目錄（學習筆記 → `docs/learning-notes/`、開發手冊 → 對應子目錄、實驗 → `experiments/`）。
2. 編輯 `site/src/content/manifest.ts`，在對應 `Section` 的 `items` 陣列加入：
   ```ts
   { order: <三位數，依分類大區起點 +1>, slug: '<url-friendly>', title: '<中文標題>', source: '<相對 repo root 的路徑>' }
   ```
3. `git add . && git commit -m "docs: add <title>" && git push`
4. GitHub Actions 自動建置與部署，1–2 分鐘後 Pages 更新。

## 分類序號規則
- 100 區段：概覽
- 200 區段：學習筆記（gstack 200–209、superpowers 211–219、對比 220+）
- 300 區段：開發手冊（架構 300、分類器 310、交接 320、失敗恢復 330、Superpowers 整合 340）
- 400 區段：實驗
- 500 區段：戰略
```

---

## 八、完成後自查清單

- [ ] `site/` 子目錄存在，`npm run dev` 能正常啟動
- [ ] 首頁 Hero 視訊有淡入淡出、CTA 連到 `/doc/roadmap`
- [ ] 側邊欄五大分類顯示正確、排序符合 `manifest.ts` 的 order
- [ ] 隨機抽 5 篇文章內容能正確渲染（包括含表格、code block 的）
- [ ] `npm run build` 成功，產出 `site/dist`
- [ ] `.github/workflows/deploy-docs.yml` 已建立
- [ ] `site/README.md` 描述了新增文章流程
- [ ] 字體：Hero 標題用 Instrument Serif、內文用 Inter；顏色 #000 / #6F6F6F / #FFF 一致
- [ ] 路由用 HashRouter（URL 帶 `#`），不會因 GitHub Pages 子路徑 404

---

## 九、需要用戶提供的資訊

執行到 Step 18 時請暫停並向用戶詢問：
1. GitHub 帳號名稱（用於組成倉庫 URL）
2. 倉庫名是否就用 `gstack-plus`
3. 是否已建立空倉庫（如未建，請用戶先在 github.com 建好再繼續）

---

*Claude 設計指令 2026-05-03*
