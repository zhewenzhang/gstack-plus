export type Item = {
  order: number;
  slug: string;
  title: string;
  source: string;
  subgroup?: string;       // 新增：子分組顯示名（僅 manual 用）
  description?: string;    // 新增：可選的一句話摘要（卡片用）
};

export type Section = {
  id: string;
  title: string;
  intro?: string;          // 新增：分類介紹（顯示在側邊欄分類標題下）
  items: Item[];
};

export const NAV: Section[] = [
  {
    id: "overview",
    title: "概覽",
    intro: "從哪裡開始：項目地圖、核心洞察與學習計劃。",
    items: [
      { order: 101, slug: "roadmap", title: "項目路線圖", source: "PROJECT_ROADMAP.md" },
      { order: 102, slug: "key-insights", title: "核心洞察", source: "docs/learning-notes/key-insights.md" },
      { order: 103, slug: "learning-plan", title: "學習計劃", source: "LEARNING_PLAN.md" },
      { order: 104, slug: "cli", title: "CLI 使用手冊", source: "cli/README.md",
        description: '`npx gstack-plus classify "..."` — 30 秒上手' },
      { order: 105, slug: "changelog", title: "CHANGELOG", source: "cli/CHANGELOG.md" },
      { order: 106, slug: "readme", title: "README", source: "README.md" },
    ],
  },
  {
    id: "learning-notes",
    title: "學習筆記",
    intro: "我們怎麼從 gstack 與 superpowers 學到「分層」與「紀律」這兩件事。",
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
    id: 'manual',
    title: '開發手冊',
    intro: '從架構到細節：三層模型協作的可執行規範。',
    items: [
      { order: 300, slug: 'getting-started', title: 'Getting Started', source: 'docs/getting-started.md' },
      { order: 301, slug: 'architecture', title: '三層架構設計', source: 'docs/architecture.md',
        subgroup: '架構', description: 'Tier-A / Tier-Mid / Tier-Exec 的角色、邊界與成本權衡' },

      { order: 311, slug: 'scoring-guide', title: '評分指南', source: 'classifier/scoring-guide.md',
        subgroup: '任務分類器', description: '5 個維度（判斷、上下文、風險、可驗證、創意）的 1–5 分標準' },
      { order: 312, slug: 'routing-rules', title: '路由規則', source: 'classifier/routing-rules.md',
        subgroup: '任務分類器', description: '從評分到 Tier 的決策表與保守路由原則' },
      { order: 313, slug: 'test-tasks', title: '測試任務集', source: 'classifier/test-tasks.md',
        subgroup: '任務分類器', description: '20+ 真實任務的分類示範與邊界案例' },

      { order: 321, slug: 'plan-to-exec', title: 'Plan → Exec', source: 'handoff/templates/plan-to-exec.md',
        subgroup: '交接模板', description: 'Tier-A 給 Tier-Exec 的可執行計劃格式' },
      { order: 322, slug: 'exec-to-check', title: 'Exec → Check', source: 'handoff/templates/exec-to-check.md',
        subgroup: '交接模板', description: 'Tier-Exec 完成後的 evidence 回報格式' },
      { order: 323, slug: 'check-to-plan', title: 'Check → Plan', source: 'handoff/templates/check-to-plan.md',
        subgroup: '交接模板', description: 'Tier-Mid 驗收結果回流給 Tier-A 的格式' },
      { order: 324, slug: 'evidence-format', title: 'Evidence 格式', source: 'handoff/templates/shared/evidence-format.md',
        subgroup: '交接模板', description: '所有「完成宣稱」必備的證據結構' },
      { order: 325, slug: 'forbidden-words', title: '禁用詞表', source: 'handoff/templates/shared/forbidden-words.md',
        subgroup: '交接模板', description: '「適當的、合理的、如果需要」等禁止用詞' },

      { order: 331, slug: 'pre-flight', title: '起飛前檢查清單', source: 'verification/pre-flight-checklist.md',
        subgroup: '失敗恢復', description: '12 項交接前必過的檢查（任務清晰 6 + Tier 3 + 失敗 3）' },
      { order: 332, slug: 'failure-catalog', title: '失敗類型目錄', source: 'verification/failure-catalog.md',
        subgroup: '失敗恢復', description: 'BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT' },
      { order: 333, slug: 'failure-routing', title: '失敗路由規則', source: 'verification/failure-routing.md',
        subgroup: '失敗恢復', description: '從失敗類型到 retry / 升級的決策樹' },

      { order: 341, slug: 'superpowers-integration', title: 'Superpowers 整合',
        source: 'docs/superpowers-integration.md',
        subgroup: '與 Superpowers 整合', description: 'brainstorming / writing-plans / verification 等 5 個整合點' },
    ],
  },
  {
    id: 'examples',
    title: '範例庫',
    intro: '5 個真實任務的完整評分過程，看別人怎麼用。',
    items: [
      { order: 351, slug: 'ex-tier-exec-eslint', title: 'Tier-Exec：加 ESLint 配置', source: 'examples/01-tier-exec-eslint.md',
        description: '機械配置任務的典型路由', subgroup: 'Tier-Exec' },
      { order: 352, slug: 'ex-tier-exec-rename', title: 'Tier-Exec：跨檔案重命名', source: 'examples/02-tier-exec-rename.md',
        description: '上下文寬但判斷低 → 仍可派 Exec', subgroup: 'Tier-Exec' },
      { order: 361, slug: 'ex-tier-mid-refactor', title: 'Tier-Mid：CQRS 重構', source: 'examples/03-tier-mid-refactor.md',
        description: '中等判斷 + 中等風險的典型', subgroup: 'Tier-Mid' },
      { order: 371, slug: 'ex-tier-a-auth', title: 'Tier-A：設計 SSO + MFA', source: 'examples/04-tier-a-auth-design.md',
        description: '三個條件同時觸發 Tier-A', subgroup: 'Tier-A' },
      { order: 391, slug: 'ex-borderline', title: '邊界案例：cursor pagination', source: 'examples/05-borderline-case.md',
        description: '保守路由原則的應用時機', subgroup: '邊界案例' },
    ],
  },
  {
    id: 'experiments',
    title: "實驗記錄",
    intro: "用真實任務驗證三層協作 vs 單模型 / 人工的差異。",
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
    intro: "把這套東西當作產品來思考：護城河、用戶、命名與商業化盲點。",
    items: [
      { order: 501, slug: "yc-blindspots", title: "YC 盲點清單", source: "YC_BLINDSPOTS.md" },
    ],
  },
];
