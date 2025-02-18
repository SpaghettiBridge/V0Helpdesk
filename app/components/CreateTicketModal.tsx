'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { X } from 'lucide-react'
import { 
  TicketPriority, 
  TicketMainCategory,
  TicketSubCategory,
  BridgelinkSubCategory,
  ITSystemSupportSubCategory,
  TrainingSubCategory
} from '../../types';

interface CreateTicketModalProps {
  onCreateTicket: (ticketData: any) => void;
}

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Impact = 'Individual' | 'Department' | 'Multiple Departments' | 'Entire Organization';

export function SubmitTicketModal({ onCreateTicket }: CreateTicketModalProps) {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    severity: '' as Severity,
    impact: '' as Impact,
    priority: '' as TicketPriority,
    mainCategory: '' as TicketMainCategory,
    subCategory: '' as TicketSubCategory,
    cc: [] as string[],
    bcc: [] as string[],
    service: '',
    attachments: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'mainCategory') {
      setTicketData(prev => ({ ...prev, mainCategory: value as TicketMainCategory, subCategory: '' as TicketSubCategory }));
    } else {
      setTicketData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (name: 'cc' | 'bcc', value: string[]) => {
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTicketData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files as FileList)]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setTicketData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const calculatePriority = (severity: Severity, impact: Impact): TicketPriority => {
    const severityScore = { Low: 1, Medium: 2, High: 3, Critical: 4 };
    const impactScore = { Individual: 1, Department: 2, 'Multiple Departments': 3, 'Entire Organization': 4 };

    const score = severityScore[severity] * impactScore[impact];

    if (score >= 12) return 'Urgent';
    if (score >= 8) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  useEffect(() => {
    if (ticketData.severity && ticketData.impact) {
      const calculatedPriority = calculatePriority(ticketData.severity, ticketData.impact);
      setTicketData(prev => ({ ...prev, priority: calculatedPriority }));
    }
  }, [ticketData.severity, ticketData.impact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket(ticketData);
  };

  const getSubCategories = () => {
    switch (ticketData.mainCategory) {
      case 'Bridgelink':
        return Object.entries(BridgelinkSubCategory).map(([key, value]) => (
          <SelectItem key={key} value={value}>{value}</SelectItem>
        ));
      case 'IT/System Support':
        return Object.entries(ITSystemSupportSubCategory).map(([key, value]) => (
          <SelectItem key={key} value={value}>{value}</SelectItem>
        ));
      case 'Training':
        return Object.entries(TrainingSubCategory).map(([key, value]) => (
          <SelectItem key={key} value={value}>{value}</SelectItem>
        ));
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#DF6F2A] hover:bg-[#E2A37A] text-white">Submit Ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" align="top">
        <DialogHeader>
          <DialogTitle>Submit New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new support ticket.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={ticketData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={ticketData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Severity
              </Label>
              <Select onValueChange={(value) => handleSelectChange('severity', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="impact" className="text-right">
                Impact
              </Label>
              <Select onValueChange={(value) => handleSelectChange('impact', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Multiple Departments">Multiple Departments</SelectItem>
                  <SelectItem value="Entire Organization">Entire Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {ticketData.priority && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Calculated Priority
                </Label>
                <div className="col-span-3 font-semibold">
                  {ticketData.priority}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mainCategory" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => handleSelectChange('mainCategory', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bridgelink">Bridgelink</SelectItem>
                  <SelectItem value="IT/System Support">IT/System Support</SelectItem>
                  <SelectItem value="Asset Register">Asset Register</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {ticketData.mainCategory && ['Bridgelink', 'IT/System Support', 'Training'].includes(ticketData.mainCategory) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subCategory" className="text-right">
                  Sub-Category
                </Label>
                <Select onValueChange={(value) => handleSelectChange('subCategory', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubCategories()}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select onValueChange={(value) => handleSelectChange('service', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Silver Bridge School">Silver Bridge School</SelectItem>
                  <SelectItem value="Preston Bridge School">Preston Bridge School</SelectItem>
                  <SelectItem value="Heather Bridge School">Heather Bridge School</SelectItem>
                  <SelectItem value="Chilton Bridge School">Chilton Bridge School</SelectItem>
                  <SelectItem value="Chapel Bridge School">Chapel Bridge School</SelectItem>
                  <SelectItem value="Meadow Bridge School">Meadow Bridge School</SelectItem>
                  <SelectItem value="Valley Bridge School">Valley Bridge School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cc" className="text-right">
                CC
              </Label>
              <div className="col-span-3">
                <MultiSelect
                  options={[
                    { label: 'user1@example.com', value: 'user1@example.com' },
                    { label: 'user2@example.com', value: 'user2@example.com' },
                    { label: 'user3@example.com', value: 'user3@example.com' },
                  ]}
                  selected={ticketData.cc}
                  onChange={(value) => handleMultiSelectChange('cc', value)}
                  placeholder="Select CC recipients"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bcc" className="text-right">
                BCC
              </Label>
              <div className="col-span-3">
                <MultiSelect
                  options={[
                    { label: 'manager1@example.com', value: 'manager1@example.com' },
                    { label: 'manager2@example.com', value: 'manager2@example.com' },
                    { label: 'manager3@example.com', value: 'manager3@example.com' },
                  ]}
                  selected={ticketData.bcc}
                  onChange={(value) => handleMultiSelectChange('bcc', value)}
                  placeholder="Select BCC recipients"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attachments" className="text-right">
                Attachments
              </Label>
              <div className="col-span-3">
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="col-span-3"
                />
              </div>
            </div>
            {ticketData.attachments.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="col-start-2 col-span-3">
                  <p className="mb-2 font-semibold">Attached Files:</p>
                  <ul className="list-disc pl-5">
                    {ticketData.attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between mb-1">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

