"use client"

import { useAuth } from "@/components/auth-provider"
import { TrainerDashboard } from "@/components/trainer/dashboard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function TrainerDashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "trainer") {
    return <div>Unauthorized</div>
  }

  return (
    <DashboardLayout>
      <TrainerDashboard />
    </DashboardLayout>
  )
}

