import React from 'react';
import { useForm } from 'react-hook-form';
import { EmailTemplate, EmailTemplateType } from '../types';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSubmit: (data: EmailTemplate) => void;
  onCancel: () => void;
}

export function EmailTemplateForm({ template, onSubmit, onCancel }: EmailTemplateFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailTemplate>({
    defaultValues: template || {
      id: '',
      name: '',
      type: 'TicketCreated',
      subject: '',
      body: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input id="name" {...register('name', { required: 'Template name is required' })} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="type">Template Type</Label>
        <Select onValueChange={(value) => register('type').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select template type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TicketCreated">Ticket Created</SelectItem>
            <SelectItem value="TicketUpdated">Ticket Updated</SelectItem>
            <SelectItem value="TicketOverdue">Ticket Overdue</SelectItem>
            <SelectItem value="AgentReply">Agent Reply</SelectItem>
            <SelectItem value="UserReply">User Reply</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      <div>
        <Label htmlFor="subject">Email Subject</Label>
        <Input id="subject" {...register('subject', { required: 'Email subject is required' })} />
        {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="body">Email Body</Label>
        <Textarea 
          id="body" 
          {...register('body', { required: 'Email body is required' })} 
          rows={10}
        />
        {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Template</Button>
      </div>
    </form>
  );
}

