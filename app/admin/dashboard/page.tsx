"use client"

import { useAuth } from "@/components/auth-provider"
import { AdminDashboard } from "@/components/admin/dashboard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return <div>Unauthorized</div>
  }

  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  )
}

