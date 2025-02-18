import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import TicketDetails from '../app/components/TicketDetails';
import { Ticket, TicketReply, User } from '../types';

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  replies: TicketReply[];
  currentUser: User;
  onReply: (content: string, type: string) => void;
  onAction: (action: string, value?: string) => void;
}

export function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
  replies,
  currentUser,
  onReply,
  onAction
}: TicketDetailModalProps) {
  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ticket #{ticket.number}</DialogTitle>
        </DialogHeader>
        <TicketDetails
          ticket={ticket}
          replies={replies}
          currentUser={currentUser}
          onReply={onReply}
          onAction={onAction}
        />
      </DialogContent>
    </Dialog>
  );
}

