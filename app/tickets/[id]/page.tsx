"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import TicketDetails from "../../components/TicketDetails"
import { Breadcrumb } from "@/app/components/Breadcrumb"
import type { Ticket, User, TicketReply } from "../../../types"

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
  // ... (add other mock tickets here)
]

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "Agent",
}

// Simple function to generate a unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<TicketReply[]>([])
  const [isFromMyTickets, setIsFromMyTickets] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchTicketData = useCallback(() => {
    const fetchedTicket = mockTickets.find((t) => t.id === params.id)
    const mockReplies = [
      {
        id: "1",
        ticketId: params.id,
        userId: "user@example.com",
        content: "I am still unable to access my email. Can you please help?",
        createdAt: new Date("2023-06-01T11:30:00"),
        type: "UserReply",
      },
      {
        id: "2",
        ticketId: params.id,
        userId: "agent1@example.com",
        content: "I'm looking into this issue. Can you please try clearing your browser cache and cookies?",
        createdAt: new Date("2023-06-01T12:00:00"),
        type: "AgentReply",
      },
    ]
    return { ticket: fetchedTicket || null, replies: mockReplies }
  }, [params.id])

  useEffect(() => {
    const { ticket, replies } = fetchTicketData()
    setTicket(ticket)
    setReplies(replies)
  }, [fetchTicketData])

  useEffect(() => {
    const fromMyTickets = searchParams.get("from") === "my-tickets"
    setIsFromMyTickets(fromMyTickets)
  }, [searchParams])

  const handleReply = useCallback(
    (content: string, type: string) => {
      console.log(`Reply to ticket ${params.id}:`, content, type)
      const newReply: TicketReply = {
        id: generateUniqueId(),
        ticketId: params.id,
        userId: mockUser.email,
        content,
        createdAt: new Date(),
        type: type as "UserReply" | "AgentReply" | "InternalComment" | "ExternalComment" | "DevelopmentComment",
      }
      setReplies((prevReplies) => [...prevReplies, newReply])
    },
    [params.id],
  )

  const handleAction = useCallback(
    (action: string, value?: string) => {
      // In a real application, you would send this to your API
      console.log(`Action on ticket ${params.id}:`, action, value)
    },
    [params.id],
  )

  const handleUpdate = useCallback((updatedTicket: Ticket) => {
    // In a real application, you would send this to your API
    console.log("Updated ticket:", updatedTicket)
    setTicket(updatedTicket)
  }, [])

  const handleClone = useCallback((ticketId: string, newMessage: string) => {
    // In a real application, you would send this to your API
    console.log(`Cloning ticket ${ticketId} with message: ${newMessage}`)
  }, [])

  const handleBreadcrumbClick = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router],
  )

  const getBreadcrumbItems = useCallback(
    () => [
      { label: "Dashboard", href: "/" },
      {
        label: isFromMyTickets ? (mockUser.role === "EndUser" ? "My Tickets" : "Assigned Tickets") : "All Tickets",
        href: isFromMyTickets ? "/my-tickets" : "/helpdesk",
      },
      { label: ticket ? `Ticket ${ticket.number}` : "Loading...", href: `/tickets/${params.id}` },
    ],
    [isFromMyTickets, ticket, params.id],
  )

  if (!ticket) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={getBreadcrumbItems()} onItemClick={handleBreadcrumbClick} />
      <h1 className="text-3xl font-bold mb-6 text-[#00697F] font-josefin-sans">Ticket {ticket.number}</h1>
      <TicketDetails
        ticket={ticket}
        replies={replies}
        currentUser={mockUser}
        onReply={handleReply}
        onAction={handleAction}
        onUpdate={handleUpdate}
        onClone={handleClone}
      />
    </div>
  )
}

