"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TicketList from "../components/TicketList";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import type { Ticket, User, TicketStatus } from "../../types";

const mockTickets: Ticket[] = [
  // Your existing mock ticket data
];

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "Agent",
};

function TicketPageContent() {
  const [tickets, setTickets] = useState(mockTickets);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ticketId = searchParams.get("ticketId");
    if (ticketId) {
      router.push(`/tickets/${ticketId}`);
    }
  }, [searchParams, router]);

  const handleCreateTicket = (ticketData: any) => {
    console.log("New ticket created:", ticketData);
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
    };
    setTickets([...tickets, newTicket]);
  };

  const handleBulkEdit = (action: string, value: string, selectedTickets: string[]) => {
    console.log(`Bulk action: ${action}, value: ${value}, tickets: ${selectedTickets.join(", ")}`);
    const updatedTickets = tickets.map((ticket) => {
      if (selectedTickets.includes(ticket.id)) {
        if (action === "changeStatus") {
          return { ...ticket, status: value as TicketStatus };
        } else if (action === "sendMessage") {
          console.log(`Sending message "${value}" to ticket ${ticket.number}`);
          return ticket;
        }
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
  };

  const handleMergeTickets = (mainTicketId: string, mergedTicketIds: string[]) => {
    console.log(`Merging tickets ${mergedTicketIds.join(", ")} into ${mainTicketId}`);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "All Tickets", href: "/helpdesk" },
  ];

  const handleBreadcrumbClick = (href: string) => {
    router.push(href);
  };

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
  );
}

export default function HelpdeskPage() {
  return (
    <Suspense fallback={<div>Loading tickets...</div>}>
      <TicketPageContent />
    </Suspense>
  );
}
