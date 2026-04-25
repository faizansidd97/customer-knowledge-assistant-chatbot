export const MOCK_USERS = [
  {
    id: "u1", fullName: "Alice Johnson", initials: "AJ",
    email: "alice@demo.com", password: "alice123",
    role: "Manager", designation: "Product Manager",
    assignedProjects: ["p1", "p2", "p3"],
    status: "active", joinedDate: "2024-01-15"
  },
  {
    id: "u2", fullName: "Bob Smith", initials: "BS",
    email: "bob@demo.com", password: "bob123",
    role: "Developer", designation: "Backend Engineer",
    assignedProjects: ["p2"],
    status: "active", joinedDate: "2024-03-08"
  },
  {
    id: "u3", fullName: "Sara Khan", initials: "SK",
    email: "sara@demo.com", password: "sara123",
    role: "Developer", designation: "Frontend Engineer",
    assignedProjects: ["p1", "p3"],
    status: "active", joinedDate: "2024-02-20"
  },
  {
    id: "u4", fullName: "James Lee", initials: "JL",
    email: "james@demo.com", password: "james123",
    role: "Viewer", designation: "Stakeholder",
    assignedProjects: ["p1"],
    status: "active", joinedDate: "2024-04-01"
  },
]

export const MOCK_PROJECTS = [
  {
    id: "p1", name: "Alpha CRM", status: "active",
    description: "Customer relationship management platform rebuild for enterprise clients.",
    datasources: ["jira", "github", "confluence"],
    memberIds: ["u1", "u3", "u4"],
    stats: {
      openIssues: 24, closedIssues: 87, sprintProgress: 68,
      teamSize: 5, velocity: 42, lastUpdated: "2 hours ago",
      currentSprint: "Sprint 14", sprintEnds: "2025-08-15",
    },
    recentActivity: [
      { userId: "u1", action: "closed ticket ACRM-142", time: "2h ago" },
      { userId: "u3", action: "pushed 3 commits to main", time: "4h ago" },
      { userId: "u4", action: "commented on PR #89", time: "5h ago" },
      { userId: "u1", action: "created Sprint 14", time: "1d ago" },
      { userId: "u3", action: "merged feature/auth-redesign", time: "1d ago" },
    ]
  },
  {
    id: "p2", name: "Data Pipeline", status: "active",
    description: "Real-time ETL pipeline powering the analytics and reporting platform.",
    datasources: ["github", "slack"],
    memberIds: ["u1", "u2"],
    stats: {
      openIssues: 11, closedIssues: 53, sprintProgress: 45,
      teamSize: 3, velocity: 28, lastUpdated: "1 day ago",
      currentSprint: "Sprint 8", sprintEnds: "2025-08-22",
    },
    recentActivity: [
      { userId: "u2", action: "fixed Kafka consumer lag issue", time: "1d ago" },
      { userId: "u1", action: "updated sprint goals", time: "2d ago" },
      { userId: "u2", action: "deployed hotfix to staging", time: "2d ago" },
      { userId: "u1", action: "reviewed architecture doc", time: "3d ago" },
      { userId: "u2", action: "opened PIPE-155 bug report", time: "3d ago" },
    ]
  },
  {
    id: "p3", name: "Mobile App v2", status: "active",
    description: "Complete redesign of the iOS and Android applications with new design system.",
    datasources: ["jira", "notion", "github"],
    memberIds: ["u1", "u3"],
    stats: {
      openIssues: 36, closedIssues: 112, sprintProgress: 82,
      teamSize: 7, velocity: 61, lastUpdated: "30 minutes ago",
      currentSprint: "Sprint 21", sprintEnds: "2025-08-10",
    },
    recentActivity: [
      { userId: "u3", action: "shipped onboarding screens", time: "30m ago" },
      { userId: "u1", action: "approved design for v2.3", time: "3h ago" },
      { userId: "u3", action: "resolved 5 UI bugs", time: "5h ago" },
      { userId: "u1", action: "updated roadmap Q3", time: "1d ago" },
      { userId: "u3", action: "started push notification work", time: "1d ago" },
    ]
  },
]
