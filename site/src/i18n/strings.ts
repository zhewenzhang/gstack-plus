export type Lang = 'zh' | 'en';

export const STRINGS = {
  // ─── Nav ───
  nav: {
    home:        { zh: '首頁',   en: 'Home' },
    playground:  { zh: '試玩場', en: 'Playground' },
    manual:      { zh: '手冊',   en: 'Docs' },
    notes:       { zh: '筆記',   en: 'Notes' },
    experiments: { zh: '實驗',   en: 'Experiments' },
    strategy:    { zh: '戰略',   en: 'Strategy' },
    getStarted:  { zh: '開始使用', en: 'Get started' },
  },

  // ─── Hero ───
  hero: {
    pill: {
      zh: 'v0.3.3 已上 npm',
      en: 'v0.3.3 live on npm',
    },
    pillUrl: 'https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.3',
    headlineHtml: {
      zh: '別讓一個模型<em class="italic" style="color:#6F6F6F">扛下所有事</em>。<br/>讓對的層級做<em class="italic" style="color:#6F6F6F">對的事。</em>',
      en: 'Stop sending <em class="italic" style="color:#6F6F6F">every task</em> to the<br/>same model. Route to the <em class="italic" style="color:#6F6F6F">right tier.</em>',
    },
    sub: {
      zh: '多層 AI 模型編排框架。把每個任務按 5 維評分路由到對應 Tier — Opus 做判斷、Sonnet 做審查、Exec 做執行。質量不打折，成本砍一半。',
      en: 'A multi-tier model orchestration framework. Route every task to the right model: Tier-A for judgment, Tier-Mid for review, Tier-Exec for execution.',
    },
    ctaPrimary:   { zh: '打開試玩場',  en: 'Open Playground' },
    ctaSecondary: { zh: '試 CLI 命令', en: 'Try the CLI' },
    ctaTertiary:  { zh: '看完整文檔 →', en: 'Read the docs →' },
  },

  // ─── QuickTry ───
  quickTry: {
    eyebrow: { zh: 'v0.3.3 · 已上線 npm', en: 'v0.3.3 · live on npm' },
    title:   { zh: '30 秒就能試一下。',  en: 'Try it in 30 seconds.' },
    body: {
      zh: '對任何任務做 5 維評分，立刻得到路由決策與一份預填好的 handoff 文件。基本流程不需要安裝、不需要 API key。',
      en: 'Score any task on 5 dimensions, get a routing decision, and a pre-filled handoff doc. No install, no API key needed for the basic flow.',
    },
    captionNoInstall: { zh: '免安裝（推薦先試這個）',   en: 'No install (recommended for first try)' },
    captionInstall:   { zh: '或全域安裝',               en: 'Or install globally' },
    captionSkip:      { zh: '跳過互動，直接給分數',     en: 'Skip the prompts' },
    sampleEyebrow:    { zh: '你會看到', en: "What you'll see" },
    linkCli:          { zh: '看完整入門指南 →', en: 'Read the Getting Started guide →' },
    linkBrowser:      { zh: '或在瀏覽器試 →',     en: 'Or try in browser →' },
  },

  // ─── HomeBelowFold ───
  below: {
    whatEyebrow: { zh: 'gstack-plus 是什麼', en: 'What is gstack-plus' },
    whatTitle: {
      zh: '一個放在 gstack 與 superpowers 之上的「模型派遣層」。',
      en: 'A model dispatch layer on top of gstack and superpowers.',
    },
    whatBody: {
      zh: '現有的 AI 工作流框架（gstack、superpowers）已經把「角色技能」做得很好，但所有任務還是丟給同一個模型。gstack-plus 在它們之上加一層分類器，把判斷、審查、執行分派到三個不同的 tier，讓你用 Opus 的判斷力 + Sonnet 的紀律 + Exec 的成本，做出比單模型更好的決策。',
      en: 'Existing AI workflow frameworks (gstack, superpowers) handle "role skills" well, but route every task to the same model. gstack-plus adds a classifier layer on top, dispatching judgment, review, and execution to three different tiers — Opus for judgment, Sonnet for review, Exec for cost. Better decisions, lower spend.',
    },

    pathEyebrow: { zh: '推薦閱讀路徑', en: 'Recommended reading path' },
    pathTitle:   { zh: '五步從動手到深入。', en: 'Five steps, from hands-on to deep.' },
    pathSteps: {
      zh: [
        { step: '01', slug: 'cli',             title: '裝 CLI 試一下',  why: '`npx gstack-plus classify "..."`，30 秒看到輸出再回來看理論' },
        { step: '02', slug: 'roadmap',         title: '看路線圖',      why: '了解專案分幾個階段、為什麼要分層' },
        { step: '03', slug: 'architecture',    title: '理解三層架構',   why: 'Tier-A / Mid / Exec 各自的角色與成本' },
        { step: '04', slug: 'routing-rules',   title: '學會分類任務',   why: '5 維評分把任務路由到正確的 Tier' },
        { step: '05', slug: 'failure-catalog', title: '掌握失敗恢復',   why: 'Exec 出錯時，何時 retry、何時升級' },
      ],
      en: [
        { step: '01', slug: 'cli',             title: 'Try the CLI',           why: '`npx gstack-plus classify "..."` — see real output before reading theory' },
        { step: '02', slug: 'roadmap',         title: 'Read the roadmap',      why: 'What phases, why we layered the system this way' },
        { step: '03', slug: 'architecture',    title: 'Grasp the 3-tier model', why: 'Roles and costs of Tier-A / Mid / Exec' },
        { step: '04', slug: 'routing-rules',   title: 'Learn to classify',     why: '5-dim scoring to route tasks to the right tier' },
        { step: '05', slug: 'failure-catalog', title: 'Master failure recovery', why: 'When to retry vs escalate when Exec fails' },
      ],
    },

    catEyebrow: { zh: '完整目錄', en: 'Full library' },
    catTitle:   { zh: '按你關心的層次切入。', en: 'Jump in at your level.' },
    catCount:   { zh: (n: number) => `${n} 篇 →`, en: (n: number) => `${n} docs →` },
  },

  // ─── Footer ───
  footer: {
    license: { zh: 'MIT 授權', en: 'MIT License' },
  },
} as const;
