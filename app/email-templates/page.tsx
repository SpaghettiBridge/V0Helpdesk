'use client'

import React, { useState } from 'react';
import { EmailTemplate } from '../../types';
import { EmailTemplateForm } from '../../components/EmailTemplateForm';
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for email templates
const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'New Ticket Created',
    type: 'TicketCreated',
    subject: 'New Support Ticket Created: {{ticketNumber}}',
    body: 'Dear {{userName}},\n\nA new support ticket has been created with the following details:\n\nTicket Number: {{ticketNumber}}\nSubject: {{ticketSubject}}\n\nWe will get back to you as soon as possible.\n\nBest regards,\nSupport Team',
  },
  {
    id: '2',
    name: 'Ticket Reply Notification',
    type: 'AgentReply',
    subject: 'Update on Your Support Ticket: {{ticketNumber}}',
    body: 'Dear {{userName}},\n\nAn update has been made to your support ticket {{ticketNumber}}. Please log in to view the latest response.\n\nBest regards,\nSupport Team',
  },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleSubmitTemplate = (data: EmailTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...data, id: t.id } : t));
    } else {
      setTemplates([...templates, { ...data, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#00697F] font-josefin-sans">Email Templates</h1>
      <Button onClick={handleCreateTemplate} className="mb-4">Create New Template</Button>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.type}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleEditTemplate(template)} className="mr-2">Edit</Button>
                <Button variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Email Template' : 'Create New Email Template'}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Edit the details of the email template.' : 'Fill in the details for the new email template.'}
            </DialogDescription>
          </DialogHeader>
          <EmailTemplateForm
            template={editingTemplate || undefined}
            onSubmit={handleSubmitTemplate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

