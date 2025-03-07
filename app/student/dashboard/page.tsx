"use client"

import { useAuth } from "@/components/auth-provider"
import { StudentDashboard } from "@/components/student/dashboard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function StudentDashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "student") {
    return <div>Unauthorized</div>
  }

  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  )
}

