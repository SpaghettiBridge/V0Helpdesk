import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import TicketDetails from "../app/components/TicketDetails"
import type { Ticket, TicketReply, User } from "../types"

interface TicketDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  replies: TicketReply[]
  currentUser: User
  onReply: (content: string, type: string) => void
  onAction: (action: string, value?: string) => void
  onUpdate: (updatedTicket: Ticket) => void
  onClone?: () => void // Added onClone prop with optional type
}

export function TicketDetailDrawer({
  isOpen,
  onClose,
  ticket,
  replies,
  currentUser,
  onReply,
  onAction,
  onUpdate,
  onClone, // Added onClone prop to function parameters
}: TicketDetailDrawerProps) {
  const [isOpenState, setIsOpen] = useState(isOpen)

  useEffect(() => {
    if (ticket) {
      setIsOpen(true)
    }
  }, [ticket])

  if (!ticket) return null

  return (
    <Sheet
      open={isOpenState}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          onClose()
        }
      }}
    >
      <SheetContent side="right" className="!w-[50%] !max-w-none p-0 bg-white">
        <SheetHeader className="p-4 border-b bg-white">
          <SheetTitle>Ticket #{ticket.number}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100vh-60px)]">
          <TicketDetails
            ticket={ticket}
            replies={replies}
            currentUser={currentUser}
            onReply={onReply}
            onAction={onAction}
            onUpdate={onUpdate}
            onClone={onClone || (() => {})} // Added onClone prop with default empty function
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

