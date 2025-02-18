"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserDashboard } from "@/components/UserDashboard"
import { TeamDashboard } from "@/components/TeamDashboard"
import { OverallDashboard } from "@/components/OverallDashboard"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("user")

  // In a real application, you would get these from the authenticated user's session
  const userId = "user123"
  const serviceId = "service456"

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#00697F] font-josefin-sans">Dashboard</h2>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="user">User Dashboard</TabsTrigger>
          <TabsTrigger value="team">Team Dashboard</TabsTrigger>
          <TabsTrigger value="overall">Overall Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="space-y-4">
          <UserDashboard userId={userId} />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamDashboard serviceId={serviceId} />
        </TabsContent>
        <TabsContent value="overall" className="space-y-4">
          <OverallDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

