import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentTicketUpdatesProps {
  userId?: string
  serviceId?: string
}

export function RecentTicketUpdates({ userId, serviceId }: RecentTicketUpdatesProps) {
  // In a real application, you would fetch this data from an API based on the props
  const recentUpdates = [
    {
      id: "1",
      ticketNumber: "TICK-001",
      title: "Cannot access email",
      status: "Open",
      updatedBy: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      ticketNumber: "TICK-002",
      title: "Billing issue",
      status: "In Progress",
      updatedBy: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      ticketNumber: "TICK-003",
      title: "Feature request",
      status: "Closed",
      updatedBy: "Bob Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="space-y-8">
      {recentUpdates.map((update) => (
        <div key={update.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={update.avatar} alt="Avatar" />
            <AvatarFallback>{update.updatedBy[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{update.ticketNumber}</p>
            <p className="text-sm text-muted-foreground">{update.title}</p>
          </div>
          <div className="ml-auto font-medium">{update.status}</div>
        </div>
      ))}
    </div>
  )
}

