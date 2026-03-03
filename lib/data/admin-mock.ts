export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  lastLogin: string
}

export interface AdminActivity {
  id: string
  action: string
  actor: string
  timestamp: string
  entity: string
}

export const adminUsers: AdminUser[] = [
  {
    id: "u-001",
    name: "Avery Cole",
    email: "avery@jetintel.com",
    role: "admin",
    lastLogin: "2 hours ago",
  },
  {
    id: "u-002",
    name: "Mia Hart",
    email: "mia@jetintel.com",
    role: "user",
    lastLogin: "Today, 09:21",
  },
  {
    id: "u-003",
    name: "Noah Briggs",
    email: "noah@jetintel.com",
    role: "user",
    lastLogin: "Not yet",
  },
  {
    id: "u-004",
    name: "Lena Ortiz",
    email: "lena@jetintel.com",
    role: "user",
    lastLogin: "3 days ago",
  },
]

export const adminActivity: AdminActivity[] = [
  {
    id: "a-1001",
    action: "Created jet entry",
    actor: "Avery Cole",
    entity: "Bombardier Global 8000",
    timestamp: "5 min ago",
  },
  {
    id: "a-1002",
    action: "Updated performance data",
    actor: "Mia Hart",
    entity: "Gulfstream G650ER",
    timestamp: "28 min ago",
  },
  {
    id: "a-1003",
    action: "Removed duplicate jet",
    actor: "Avery Cole",
    entity: "Citation Sovereign",
    timestamp: "1 hour ago",
  },
  {
    id: "a-1004",
    action: "Invited new team member",
    actor: "Mia Hart",
    entity: "noah@jetintel.com",
    timestamp: "Yesterday",
  },
]
