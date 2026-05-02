export interface Item {
  order: number;
  slug: string;
  title: string;
  source: string;
}

export interface Section {
  id: string;
  title: string;
  items: Item[];
}

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
