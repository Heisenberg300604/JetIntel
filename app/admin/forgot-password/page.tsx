import { redirect } from "next/navigation"

export default function AdminForgotPasswordPage() {
  redirect("/auth/forgot-password")
}
