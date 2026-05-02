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

## 本地開發

```bash
cd site
npm install
npm run dev
```

## 技術棧

Vite + React 18 + TypeScript + Tailwind CSS + react-markdown + HashRouter（GitHub Pages 兼容）
