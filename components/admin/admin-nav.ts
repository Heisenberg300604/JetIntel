import {
  LayoutDashboard,
  Plane,
  Users,
  PlusCircle,
} from "lucide-react"

export const adminNavItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/jets",
    label: "Jets",
    icon: Plane,
  },
  {
    href: "/admin/jets/new",
    label: "Add Jet",
    icon: PlusCircle,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
] as const

export function getAdminPageTitle(pathname: string) {
  if (pathname === "/admin") return "Admin Dashboard"
  if (pathname.startsWith("/admin/jets/new")) return "Create Jet"
  if (pathname.startsWith("/admin/jets/") && pathname.endsWith("/edit")) return "Edit Jet"
  if (pathname.startsWith("/admin/jets")) return "Jet Management"
  if (pathname.startsWith("/admin/users")) return "User Management"
  return "Admin"
}
