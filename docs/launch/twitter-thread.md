# Twitter / X 發布草稿

---

**Tweet 1（主推）：**
I built a CLI to route AI coding tasks to the right model tier.

Not every task needs Opus. Here's a 5-dimension framework for deciding which model to use 🧵

**Tweet 2：**
The 5 dimensions:

1. Judgment Strength – mechanical vs. deep reasoning
2. Context Width – one file vs. whole system
3. Risk Weight – style vs. security/data
4. Verifiability – subjective vs. objectively testable
5. Creativity Density – template vs. open-ended design

**Tweet 3：**
The routing rule:

→ judgment≥4 OR risk≥4 OR creativity≥4
   → Tier-A (Opus / GPT-4)

→ judgment≤2 AND context≤2 AND verifiability≥4
   → Tier-Exec (Qwen Code / Haiku)

→ everything else
   → Tier-Mid (Sonnet / GPT-4o)

**Tweet 4：**
In practice: I use Claude (Sonnet) to plan + review, Qwen Code to execute.

On an 18-phase build, this reduced Tier-A usage by ~60% — without dropping quality.

The key: Tier-A handles judgment, Tier-Exec handles execution.

**Tweet 5：**
The CLI generates a structured handoff doc.

You fill in the 5 scores.
It picks the tier.
It generates a markdown template to paste to the right model.

```
npm install -g gstack-plus
gstack-plus classify
```

**Tweet 6：**
Browse 5 worked examples (ESLint fix → Tier-Exec, Auth system → Tier-A, etc.):

```
gstack-plus examples
```

GitHub: https://github.com/zhewenzhang/gstack-plus
Docs: https://zhewenzhang.github.io/gstack-plus/

What routing heuristics do you use? Curious if others have found better rules.

---

**發布前 checklist**
- [ ] 確認每條 tweet 字數在 280 字符以內
- [ ] 第一條附圖（CLI 截圖或 Playground 截圖）效果更好
- [ ] 用 Thread 方式一次發完
