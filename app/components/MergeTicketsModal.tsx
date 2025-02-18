import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Ticket } from "../../types"

interface MergeTicketsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTickets: Ticket[]
  onMerge: (mainTicketId: string) => void
}

export function MergeTicketsModal({ isOpen, onClose, selectedTickets, onMerge }: MergeTicketsModalProps) {
  const [mainTicketId, setMainTicketId] = useState<string>("")

  const handleMerge = () => {
    if (mainTicketId) {
      onMerge(mainTicketId)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge Tickets</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">Select the main ticket to merge others into:</p>
          <Select onValueChange={setMainTicketId} value={mainTicketId}>
            <SelectTrigger>
              <SelectValue placeholder="Select main ticket" />
            </SelectTrigger>
            <SelectContent>
              {selectedTickets.map((ticket) => (
                <SelectItem key={ticket.id} value={ticket.id}>
                  {ticket.number} - {ticket.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={!mainTicketId}>
            Merge Tickets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

