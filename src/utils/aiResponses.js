export const AI_RESPONSES = {
  p1: {
    summary:
      `**Alpha CRM** is currently in Sprint 14 with **68% completion**.\n\nThe team of 5 has resolved 87 tickets this quarter with 24 still open. The sprint ends on **August 15th**. Recent highlights include a major auth redesign merge and steady velocity of 42 points per sprint.`,
    issues:
      `Here are the top open issues in **Alpha CRM**:\n\n- \`ACRM-156\` Login timeout on Safari — *(High)*\n- \`ACRM-154\` Export CSV missing headers — *(Medium)*\n- \`ACRM-149\` Dashboard filters reset on refresh — *(Medium)*\n- \`ACRM-142\` Bulk email fails > 500 contacts — *(High)*\n- \`ACRM-138\` Dark mode toggle flickers — *(Low)*`,
    sprint:
      `**Sprint 14** is **68% complete** with 8 days remaining.\n\nCompleted: 17 of 25 story points\nRemaining: 8 story points across 6 tasks\nTeam velocity this sprint is tracking above average at **42 pts**.\nSprint ends: **August 15, 2025**`,
    team:
      `**Alpha CRM** team members:\n\n- **Alice Johnson** — Product Manager *(Sprint Owner)*\n- **Sara Khan** — Frontend Engineer\n- **James Lee** — Stakeholder / QA\n\nPlus 2 external contractors handling backend API work.`,
    deadline:
      `Upcoming deadlines for **Alpha CRM**:\n\n- **Aug 15** — Sprint 14 closes\n- **Aug 22** — Beta release to internal users\n- **Sep 5** — Client UAT begins\n- **Sep 30** — Q3 production release`,
    datasource:
      `**Alpha CRM** is connected to **3 datasources**:\n\n- ✓ **Jira** — 24 open, 87 closed tickets synced\n- ✓ **GitHub** — Last commit 4 hours ago (main branch)\n- ✓ **Confluence** — 14 docs, last updated yesterday`,
    default:
      `I can help you with **Alpha CRM** project info. Try asking about:\n\n- Open issues or bug reports\n- Current sprint status and progress\n- Team members and roles\n- Upcoming deadlines\n- Connected datasources`,
  },

  p2: {
    summary:
      `**Data Pipeline** is in Sprint 8 at **45% completion**.\n\nThe lean team of 3 manages a real-time ETL system with 11 open issues. Velocity is 28 pts/sprint. A recent Kafka consumer lag fix was deployed to staging yesterday.`,
    issues:
      `Open issues in **Data Pipeline**:\n\n- \`PIPE-155\` Redis cache not invalidating on write — *(High)*\n- \`PIPE-153\` ETL job fails on null timestamp — *(High)*\n- \`PIPE-150\` Kafka lag spike during peak hours — *(Medium)*\n- \`PIPE-148\` S3 export missing timezone offset — *(Low)*\n- \`PIPE-145\` Monitoring alert threshold too sensitive — *(Low)*`,
    sprint:
      `**Sprint 8** is **45% complete** with 12 days remaining.\n\nCompleted: 12 of 28 story points\nBlocked: 2 tasks pending DevOps approval\nNext milestone: staging deployment on **August 18**\nSprint ends: **August 22, 2025**`,
    team:
      `**Data Pipeline** team:\n\n- **Alice Johnson** — Product Manager\n- **Bob Smith** — Backend Engineer *(Tech Lead)*\n\nSupported by 1 part-time DevOps engineer for infra tasks.`,
    deadline:
      `**Data Pipeline** key dates:\n\n- **Aug 18** — Staging deployment\n- **Aug 22** — Sprint 8 close\n- **Sep 12** — Performance benchmarking\n- **Oct 1** — v2.0 production cutover`,
    datasource:
      `**Data Pipeline** datasources:\n\n- ✓ **GitHub** — 8 open PRs, last push 1 day ago\n- ✓ **Slack** — #data-pipeline channel connected, 3 alerts today`,
    default:
      `I can help with **Data Pipeline** info. Try:\n\n- Current open issues\n- Sprint 8 progress\n- Team details\n- Upcoming release dates\n- Datasource connection status`,
  },

  p3: {
    summary:
      `**Mobile App v2** is the most active project, in Sprint 21 at **82% complete**.\n\nThe team of 7 has shipped 112 tickets this quarter. Onboarding screens just went live. The v2.3 design was approved today and push notification work has started.`,
    issues:
      `Open issues in **Mobile App v2**:\n\n- \`MOB-203\` Push notification permission prompt crashes iOS 16 — *(Critical)*\n- \`MOB-199\` Onboarding back-swipe loses form state — *(High)*\n- \`MOB-197\` Dark mode icon assets missing on Android — *(Medium)*\n- \`MOB-194\` Bottom tab bar overlaps keyboard on small screens — *(Medium)*\n- \`MOB-190\` Profile photo upload fails on slow 3G — *(Low)*`,
    sprint:
      `**Sprint 21** is **82% complete** — almost done!\n\nCompleted: 50 of 61 story points\nRemaining: 11 pts across 4 tasks\nHigh velocity sprint — team is at **61 pts** this cycle\nSprint ends: **August 10, 2025** (in 3 days)`,
    team:
      `**Mobile App v2** team:\n\n- **Alice Johnson** — Product Manager\n- **Sara Khan** — Frontend / React Native Lead\n\nPlus 5 external mobile engineers (iOS × 2, Android × 2, QA × 1).`,
    deadline:
      `**Mobile App v2** upcoming:\n\n- **Aug 10** — Sprint 21 closes (3 days!)\n- **Aug 17** — App Store submission\n- **Aug 24** — Play Store submission\n- **Sep 1** — Public v2 launch 🚀`,
    datasource:
      `**Mobile App v2** datasources:\n\n- ✓ **Jira** — 36 open tickets, sprint board active\n- ✓ **GitHub** — Last commit 30 minutes ago\n- ✓ **Notion** — Design spec and roadmap docs linked`,
    default:
      `I can help with **Mobile App v2**. Try asking:\n\n- Critical open bugs\n- Sprint 21 status\n- App store submission timeline\n- Team and roles\n- Datasource connections`,
  },
}

export function generateMockResponse(message, projectId) {
  const m = message.toLowerCase()
  const responses = AI_RESPONSES[projectId]
  if (!responses) return "Please select a project to get started."

  if (m.includes("summary") || m.includes("overview") || m.includes("tell me about") || m.includes("what is"))
    return responses.summary
  if (m.includes("issue") || m.includes("bug") || m.includes("ticket") || m.includes("problem") || m.includes("error"))
    return responses.issues
  if (m.includes("sprint") || m.includes("progress") || m.includes("status") || m.includes("completion"))
    return responses.sprint
  if (m.includes("team") || m.includes("member") || m.includes("who") || m.includes("people") || m.includes("staff"))
    return responses.team
  if (m.includes("deadline") || m.includes("due") || m.includes("date") || m.includes("launch") || m.includes("release") || m.includes("when"))
    return responses.deadline
  if (m.includes("datasource") || m.includes("jira") || m.includes("github") || m.includes("confluence") || m.includes("slack") || m.includes("notion") || m.includes("connected"))
    return responses.datasource

  return responses.default
}
