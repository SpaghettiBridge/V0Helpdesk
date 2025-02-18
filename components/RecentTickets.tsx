import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTickets() {
  return (
    <div className="space-y-8">
      {recentTickets.map((ticket) => (
        <div key={ticket.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={ticket.avatar} alt="Avatar" />
            <AvatarFallback>{ticket.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{ticket.name}</p>
            <p className="text-sm text-muted-foreground">
              {ticket.title}
            </p>
          </div>
          <div className="ml-auto font-medium">{ticket.status}</div>
        </div>
      ))}
    </div>
  )
}

const recentTickets = [
  {
    id: "1",
    name: "Olivia Martin",
    title: "Cannot access email",
    status: "Open",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jackson Lee",
    title: "Billing issue",
    status: "In Progress",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    title: "Feature request",
    status: "Closed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "William Kim",
    title: "Login problem",
    status: "Open",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Sofia Davis",
    title: "Data export issue",
    status: "In Progress",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

