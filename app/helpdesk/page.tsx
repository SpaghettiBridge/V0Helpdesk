"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import TicketList from "../components/TicketList"
import { Breadcrumb } from "@/app/components/Breadcrumb"
import type { Ticket, User, TicketStatus } from "../../types"

// This would normally come from an API or database
const mockTickets: Ticket[] = [
  {
    id: "1",
    number: "TICK-001",
    priority: "High",
    mainCategory: "IT/System Support",
    subCategory: "Email",
    title: "Cannot access email",
    description: "I am unable to access my email account.",
    status: "Open",
    createdBy: "user@example.com",
    assignedAgent: "agent1@example.com",
    createdAt: new Date("2023-06-01T10:00:00"),
    updatedAt: new Date("2023-06-01T10:00:00"),
    lastReplyBy: "user@example.com",
    lastReplyAt: new Date("2023-06-01T11:00:00"),
    lastUpdatedAt: new Date("2023-06-01T11:00:00"),
    cc: ["user2@example.com"],
    bcc: ["manager@example.com"],
    service: "Silver Bridge School",
  },
  {
    id: "2",
    number: "TICK-002",
    priority: "Medium",
    mainCategory: "Bridgelink",
    subCategory: "Admissions",
    title: "Incorrect charge on invoice",
    description: "The amount on my latest invoice is incorrect.",
    status: "In Progress",
    createdBy: "customer@example.com",
    assignedAgent: "agent2@example.com",
    createdAt: new Date("2023-06-02T14:30:00"),
    updatedAt: new Date("2023-06-02T14:30:00"),
    lastReplyBy: "agent2@example.com",
    lastReplyAt: new Date("2023-06-02T15:30:00"),
    lastUpdatedAt: new Date("2023-06-02T15:30:00"),
    cc: [],
    bcc: [],
    service: "Preston Bridge School",
  },
  {
    id: "3",
    number: "TICK-003",
    priority: "Low",
    mainCategory: "General Inquiries",
    subCategory: "Account Management",
    title: "Update account information",
    description: "I need to update my account information.",
    status: "Open",
    createdBy: "newuser@example.com",
    assignedAgent: null,
    createdAt: new Date("2023-06-03T09:15:00"),
    updatedAt: new Date("2023-06-03T09:15:00"),
    lastReplyBy: null,
    lastReplyAt: null,
    lastUpdatedAt: new Date("2023-06-03T09:15:00"),
    cc: [],
    bcc: [],
    service: "Heather Bridge School",
  },
  {
    id: "4",
    number: "TICK-004",
    priority: "Urgent",
    mainCategory: "IT/System Support",
    subCategory: "Website",
    title: "Website down",
    description: "Our company website is not loading.",
    status: "Closed",
    createdBy: "manager@example.com",
    assignedAgent: "agent3@example.com",
    createdAt: new Date("2023-06-04T16:45:00"),
    updatedAt: new Date("2023-06-04T16:45:00"),
    lastReplyBy: "agent3@example.com",
    lastReplyAt: new Date("2023-06-04T17:45:00"),
    lastUpdatedAt: new Date("2023-06-04T17:45:00"),
    cc: [],
    bcc: [],
    service: "Chilton Bridge School",
  },
]

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "Agent",
}

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ticketId = searchParams.get("ticketId")
    if (ticketId) {
      router.push(`/tickets/${ticketId}`)
    }
  }, [searchParams, router])

  const handleCreateTicket = (ticketData: any) => {
    // In a real application, you would send this to your API
    console.log("New ticket created:", ticketData)
    // For now, we'll just add it to our mock tickets
    const newTicket: Ticket = {
      id: (tickets.length + 1).toString(),
      number: `TICK-00${tickets.length + 1}`,
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReplyBy: mockUser.email,
      lastReplyAt: new Date(),
      lastUpdatedAt: new Date(),
      cc: ticketData.cc || [],
      bcc: ticketData.bcc || [],
      service: ticketData.service || "Unknown Service",
    }
    setTickets([...tickets, newTicket])
  }

  const handleBulkEdit = (action: string, value: string, selectedTickets: string[]) => {
    // In a real application, you would send this to your API
    console.log(`Bulk action: ${action}, value: ${value}, tickets: ${selectedTickets.join(", ")}`)
    // For now, we'll just update our mock tickets
    const updatedTickets = tickets.map((ticket) => {
      if (selectedTickets.includes(ticket.id)) {
        if (action === "changeStatus") {
          return { ...ticket, status: value as TicketStatus }
        } else if (action === "sendMessage") {
          // In a real application, you would add this message to the ticket's history
          console.log(`Sending message "${value}" to ticket ${ticket.number}`)
          return ticket
        }
      }
      return ticket
    })
    setTickets(updatedTickets)
  }

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId))
  }

  const handleMergeTickets = (mainTicketId: string, mergedTicketIds: string[]) => {
    // Implement merge logic here
    console.log(`Merging tickets ${mergedTicketIds.join(", ")} into ${mainTicketId}`)
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "All Tickets", href: "/helpdesk" },
  ]

  const handleBreadcrumbClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={breadcrumbItems} onItemClick={handleBreadcrumbClick} />
      <h1 className="text-3xl font-bold mb-6 text-[#00697F] font-josefin-sans">All Helpdesk Tickets</h1>
      <TicketList
        tickets={tickets}
        currentUser={mockUser}
        onCreateTicket={handleCreateTicket}
        onBulkEdit={handleBulkEdit}
        onDeleteTicket={handleDeleteTicket}
        onMergeTickets={handleMergeTickets}
      />
    </div>
  )
}

