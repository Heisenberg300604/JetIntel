import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

export default function AdminPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-col">
        <AdminTopbar />
        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  )
}
