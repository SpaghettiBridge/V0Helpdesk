"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TicketList from "../components/TicketList"
import { Breadcrumb } from "@/app/components/Breadcrumb"
import type { Ticket, User } from "../../types"

// This would normally come from an API or database
const mockTickets: Ticket[] = [
  {
    id: "1",
    number: "TICK-001",
    priority: "High",
    category: "Technical",
    title: "Cannot access email",
    description: "I am unable to access my email account.",
    status: "Open",
    createdBy: "user@example.com",
    assignedAgent: "john@example.com",
    createdAt: new Date("2023-06-01T10:00:00"),
    updatedAt: new Date("2023-06-01T10:00:00"),
  },
  {
    id: "2",
    number: "TICK-002",
    priority: "Medium",
    category: "Billing",
    title: "Incorrect charge on invoice",
    description: "The amount on my latest invoice is incorrect.",
    status: "In Progress",
    createdBy: "customer@example.com",
    assignedAgent: "john@example.com",
    createdAt: new Date("2023-06-02T14:30:00"),
    updatedAt: new Date("2023-06-02T14:30:00"),
  },
  {
    id: "3",
    number: "TICK-003",
    priority: "Low",
    category: "General",
    title: "Update account information",
    description: "I need to update my account information.",
    status: "Open",
    createdBy: "john@example.com",
    assignedAgent: null,
    createdAt: new Date("2023-06-03T09:15:00"),
    updatedAt: new Date("2023-06-03T09:15:00"),
  },
  {
    id: "4",
    number: "TICK-004",
    priority: "Urgent",
    category: "Technical",
    title: "Website down",
    description: "Our company website is not loading.",
    status: "In Progress",
    createdBy: "manager@example.com",
    assignedAgent: "john@example.com",
    createdAt: new Date("2023-06-04T16:45:00"),
    updatedAt: new Date("2023-06-04T16:45:00"),
  },
]

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "Agent",
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would fetch the user's tickets from an API
    const userTickets =
      mockUser.role === "EndUser"
        ? mockTickets.filter((ticket) => ticket.createdBy === mockUser.email)
        : mockTickets.filter((ticket) => ticket.assignedAgent === mockUser.email)
    setTickets(userTickets)
  }, [])

  const handleCreateTicket = (ticketData: any) => {
    // Implementation similar to HelpdeskPage
  }

  const handleBulkEdit = (action: string, value: string, selectedTickets: string[]) => {
    // Implementation similar to HelpdeskPage
  }

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId))
  }

  const handleMergeTickets = (mainTicketId: string, mergedTicketIds: string[]) => {
    // Implementation similar to HelpdeskPage
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: mockUser.role === "EndUser" ? "My Tickets" : "Assigned Tickets", href: "/my-tickets" },
  ]

  const handleBreadcrumbClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={breadcrumbItems} onItemClick={handleBreadcrumbClick} />
      <h1 className="text-3xl font-bold mb-6 text-[#00697F] font-josefin-sans">
        {mockUser.role === "EndUser" ? "My Tickets" : "Assigned Tickets"}
      </h1>
      <TicketList
        tickets={tickets}
        currentUser={mockUser}
        onCreateTicket={handleCreateTicket}
        onBulkEdit={handleBulkEdit}
        onDeleteTicket={handleDeleteTicket}
        onMergeTickets={handleMergeTickets}
        onTicketClick={(ticketId) => router.push(`/tickets/${ticketId}?from=my-tickets`)}
      />
    </div>
  )
}

