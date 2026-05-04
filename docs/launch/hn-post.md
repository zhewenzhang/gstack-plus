# HN "Show HN" 草稿

**標題**：Show HN: gstack-plus – Route AI coding tasks to the right model tier

---

**正文**：

I built a CLI + methodology for routing AI coding tasks to the right model tier, so you're not sending every task to your most expensive model.

**The core insight**: Most tasks don't need Opus/GPT-4. But the hard part is *knowing which ones do*.

I score tasks on 5 dimensions:
- Judgment Strength (1–5): mechanical execution vs. deep reasoning
- Context Width: one file vs. entire system
- Risk Weight: style change vs. security/data
- Verifiability: subjective vs. objectively testable (build passes)
- Creativity Density: template-filling vs. open-ended design

Routing rule:
```
judgment≥4 OR risk≥4 OR creativity≥4  →  Tier-A (Opus, GPT-4)
judgment≤2 AND context≤2 AND verifiability≥4  →  Tier-Exec (Qwen Code, Haiku)
everything else  →  Tier-Mid (Sonnet, GPT-4o)
```

In practice: I use Claude (Sonnet) as planner + reviewer, Qwen Code as executor. On an 18-phase project I ran recently, this approach reduced Tier-A usage by ~60% while maintaining quality.

The CLI generates structured handoff docs — you fill in the scoring, it generates a markdown handoff template to paste to whichever model you're routing to.

**Try it:**
```
npm install -g gstack-plus
gstack-plus classify    # score a task and get a handoff doc
gstack-plus examples    # browse 5 worked examples
```

GitHub: https://github.com/zhewenzhang/gstack-plus
Docs: https://zhewenzhang.github.io/gstack-plus/

Happy to discuss the routing heuristics or the handoff template format — I've found the "verifiability" dimension to be the most useful predictor of whether Qwen Code can handle something without review.

---

**發布前 checklist**
- [ ] 在 HN 登入帳號後，選 "Submit" → "Show HN"
- [ ] 確認連結可訪問（npm install / GitHub / Docs）
- [ ] 準備好在留言區回答關於評分維度的問題
