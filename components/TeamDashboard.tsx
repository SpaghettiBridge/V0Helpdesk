import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentTicketUpdates } from "@/components/RecentTicketUpdates"
import { TicketStatusChart } from "@/components/TicketStatusChart"

interface TeamDashboardProps {
  serviceId: string
}

export function TeamDashboard({ serviceId }: TeamDashboardProps) {
  // In a real application, you would fetch this data from an API
  const totalTickets = 156
  const ticketsNeedingReply = 23
  const openTickets = 45

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Needing Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsNeedingReply}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ticket Status</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <TicketStatusChart serviceId={serviceId} />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Ticket Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTicketUpdates serviceId={serviceId} />
        </CardContent>
      </Card>
    </div>
  )
}

