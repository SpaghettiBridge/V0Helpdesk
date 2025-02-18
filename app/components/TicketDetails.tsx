import { useState, useEffect } from "react"
import type { Ticket, TicketReply, User, TicketPriority, TicketStatus, TicketMainCategory } from "../../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Edit2Icon, XIcon } from "lucide-react"
import { BridgelinkSubCategory, ITSystemSupportSubCategory, TrainingSubCategory } from "../../types"

interface TicketDetailsProps {
  ticket: Ticket
  replies: TicketReply[]
  currentUser: User
  onReply: (content: string, type: string) => void
  onAction: (action: string, value?: any) => void
  onUpdate: (updatedTicket: Ticket) => void
  onClone: (ticketId: string, newMessage: string) => void
}

export default function TicketDetails({
  ticket,
  replies,
  currentUser,
  onReply,
  onAction,
  onUpdate,
  onClone,
}: TicketDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTicket, setEditedTicket] = useState({
    ...ticket,
    severity: ticket.severity || "Low",
    impact: ticket.impact || "Individual",
  })
  const [replyContent, setReplyContent] = useState("")
  const [replyType, setReplyType] = useState("UserReply")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false)
  const [reopenReason, setReopenReason] = useState("")
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false)
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false)
  const [cloneReason, setCloneReason] = useState("")
  const [isCloseTicketDialogOpen, setIsCloseTicketDialogOpen] = useState(false)
  const [closeTicketCategory, setCloseTicketCategory] = useState<TicketMainCategory | "">("")
  const [closeTicketReason, setCloseTicketReason] = useState("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedMessageContent, setEditedMessageContent] = useState("")
  const [editedMessageAttachments, setEditedMessageAttachments] = useState<any[]>([])
  const [exampleReplies, setExampleReplies] = useState([
    {
      id: "1",
      userId: "user@example.com",
      content: "I am unable to access my email account. Can you please help?",
      createdAt: new Date("2023-06-01T10:00:00"),
      type: "UserReply",
    },
    {
      id: "2",
      userId: "agent1@example.com",
      content:
        "Thank you for reaching out. I'd be happy to help. Can you please provide more details about the error you're seeing?",
      createdAt: new Date("2023-06-01T10:30:00"),
      type: "AgentReply",
    },
    {
      id: "3",
      userId: "dev@example.com",
      content: "Checking the email server logs. No apparent issues found. Might be a client-side problem.",
      createdAt: new Date("2023-06-01T11:00:00"),
      type: "DevelopmentComment",
      attachments: [{ name: "server_logs.txt", size: 24576, type: "text/plain" }],
    },
    {
      id: "4",
      userId: "agent2@example.com",
      content: "User might need to clear their browser cache or check their internet connection.",
      createdAt: new Date("2023-06-01T11:30:00"),
      type: "InternalComment",
    },
    {
      id: "5",
      userId: "agent1@example.com",
      content: "We've checked our email servers, and everything seems to be working correctly on our end.",
      createdAt: new Date("2023-06-01T12:00:00"),
      type: "ExternalComment",
    },
    {
      id: "6",
      userId: "agent1@example.com",
      content:
        "Try clearing your browser cache and cookies, then restart your browser. This often resolves login issues.",
      createdAt: new Date("2023-06-01T12:30:00"),
      type: "SuggestSolution",
      attachments: [{ name: "clear_cache_instructions.pdf", size: 159744, type: "application/pdf" }],
    },
    {
      id: "7",
      userId: "agent1@example.com",
      content:
        "Could you please provide a screenshot of the error message you're seeing when trying to access your email?",
      createdAt: new Date("2023-06-01T13:00:00"),
      type: "RequestInfo",
    },
    {
      id: "8",
      userId: "user@example.com",
      content: "Here's a screenshot of the error message I'm seeing when trying to log in.",
      createdAt: new Date("2023-06-01T13:15:00"),
      type: "UserReply",
      attachments: [{ name: "error_screenshot.png", size: 1258291, type: "image/png" }],
    },
    {
      id: "9",
      userId: "System",
      content: "Ticket status updated to 'In Progress'",
      createdAt: new Date("2023-06-01T13:30:00"),
      type: "SystemMessage",
    },
  ])

  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([])

  const isClosedOrResolved = editedTicket.status === "Closed" || editedTicket.status === "Resolved"
  const isAgent = currentUser.role === "Agent" || currentUser.role === "SeniorAgent"

  const isClosedForMoreThan30Days = () => {
    if (editedTicket.status !== "Closed") return false
    const closedDate = new Date(editedTicket.updatedAt)
    const currentDate = new Date()
    const differenceInDays = (currentDate.getTime() - closedDate.getTime()) / (1000 * 3600 * 24)
    return differenceInDays > 30
  }

  useEffect(() => {
    setAuditLog([
      {
        timestamp: new Date(ticket.createdAt),
        user: ticket.createdBy,
        action: "Ticket Created",
        details: `Ticket #${ticket.number} created`,
      },
    ])
  }, [ticket])

  useEffect(() => {
    if (ticket.number === "TICK-001") {
      setTicketReplies(exampleReplies)
    } else {
      const mockReplies: TicketReply[] = [
        {
          id: `${ticket.id}-1`,
          ticketId: ticket.id,
          userId: ticket.createdBy,
          content: `Initial request: ${ticket.description}`,
          createdAt: ticket.createdAt,
          type: "UserReply",
        },
      ]

      if (ticket.assignedAgent) {
        mockReplies.push({
          id: `${ticket.id}-2`,
          ticketId: ticket.id,
          userId: ticket.assignedAgent,
          content: "Thank you for your request. I'm looking into this issue and will get back to you shortly.",
          createdAt: new Date(ticket.createdAt.getTime() + 3600000),
          type: "AgentReply",
        })
      }

      switch (ticket.number) {
        case "TICK-002":
          mockReplies.push({
            id: `${ticket.id}-3`,
            ticketId: ticket.id,
            userId: ticket.assignedAgent || "agent@example.com",
            content:
              "I've checked the Bridgelink system and found that there's a known issue with date formatting in some browsers. Can you please try using the Chrome browser and ensure your system's date format is set to DD/MM/YYYY? If the problem persists, please provide a screenshot of the error message.",
            createdAt: new Date(ticket.createdAt.getTime() + 7200000),
            type: "AgentReply",
          })
          break
        case "TICK-003":
          mockReplies.push({
            id: `${ticket.id}-3`,
            ticketId: ticket.id,
            userId: "itmanager@example.com",
            content:
              "Thank you for your request. I've reviewed your current laptop's specifications and usage history. Based on your needs, I recommend upgrading to our standard model LP-2023-A, which should significantly improve your productivity. I'll need approval from your department head before proceeding with the order. I've cc'd them on this ticket.",
            createdAt: new Date(ticket.createdAt.getTime() + 86400000),
            type: "AgentReply",
          })
          break
        case "TICK-004":
          mockReplies.push({
            id: `${ticket.id}-3`,
            ticketId: ticket.id,
            userId: ticket.assignedAgent || "agent@example.com",
            content:
              "I understand the urgency of this issue. Our network team is currently investigating the problem. We've identified that the main router is unresponsive. A technician is being dispatched to the school to replace the faulty hardware. Estimated time of arrival is within the next 30 minutes. We'll provide updates as soon as we have more information.",
            createdAt: new Date(ticket.createdAt.getTime() + 1800000),
            type: "AgentReply",
          })
          break
      }

      setTicketReplies(mockReplies)
    }
  }, [ticket, exampleReplies])

  const addAuditEntry = (action: string, details: string) => {
    setAuditLog((prevLog) => [
      ...prevLog,
      {
        timestamp: new Date(),
        user: currentUser.name,
        action,
        details,
      },
    ])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTicket((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTicket((prev) => ({ ...prev, [name]: value }))
    if (name === "severity" || name === "impact") {
      const newPriority = calculatePriority(
        name === "severity" ? value : editedTicket.severity,
        name === "impact" ? value : editedTicket.impact,
      )
      setEditedTicket((prev) => ({ ...prev, priority: newPriority }))
    }
  }

  const handleSaveChanges = () => {
    onUpdate(editedTicket)
    setIsEditing(false)
    addAuditEntry("Ticket Updated", "Ticket details were edited")
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyContent.trim()) {
      const newReply = {
        id: Date.now().toString(),
        userId: currentUser.email,
        content: replyContent,
        createdAt: new Date(),
        type: replyType,
      }
      onReply(replyContent, replyType)
      if (ticket.number === "TICK-001") {
        setExampleReplies((prevReplies) => [...prevReplies, newReply])
      }
      setReplyContent("")
      setAttachments([])
      addAuditEntry("Reply Added", `${replyType} added to the ticket`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const getReplyBackgroundColor = (type: string) => {
    switch (type) {
      case "DevelopmentComment":
        return "bg-purple-100"
      case "InternalComment":
        return "bg-yellow-100"
      case "ExternalComment":
        return "bg-green-100"
      case "SuggestSolution":
        return "bg-blue-100"
      case "RequestInfo":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  const handleReopen = () => {
    setIsReopenDialogOpen(true)
  }

  const handleReopenConfirm = () => {
    if (reopenReason.trim()) {
      onAction("reopen", reopenReason)
      setEditedTicket((prev) => ({ ...prev, status: "Reopened" as TicketStatus }))
      onReply(reopenReason, "SystemMessage")
      addAuditEntry("Ticket Reopened", `Ticket reopened. Reason: ${reopenReason}`)
      setIsReopenDialogOpen(false)
      setReopenReason("")
    }
  }

  const handleClone = () => {
    setIsCloneDialogOpen(true)
  }

  const handleCloneConfirm = () => {
    if (cloneReason.trim()) {
      onClone(ticket.id, cloneReason)
      addAuditEntry("Ticket Cloned", `Ticket cloned. Reason: ${cloneReason}`)
      setIsCloneDialogOpen(false)
      setCloneReason("")
    }
  }

  const handleCloseTicket = () => {
    setIsCloseTicketDialogOpen(true)
  }

  const handleCloseTicketConfirm = () => {
    if (closeTicketCategory && closeTicketReason) {
      onAction("close", { category: closeTicketCategory, reason: closeTicketReason })
      setEditedTicket((prev) => ({
        ...prev,
        status: "Closed" as TicketStatus,
        mainCategory: closeTicketCategory as TicketMainCategory,
        reason: closeTicketReason,
      }))
      onReply(`Ticket closed. Category: ${closeTicketCategory}, Reason: ${closeTicketReason}`, "SystemMessage")
      addAuditEntry("Ticket Closed", `Ticket closed. Category: ${closeTicketCategory}, Reason: ${closeTicketReason}`)
      setIsCloseTicketDialogOpen(false)
      setCloseTicketCategory("")
      setCloseTicketReason("")
    }
  }

  const handleEditMessage = (messageId: string, content: string, attachments: any[]) => {
    // Update: Added check for agent permission before editing
    const reply = ticketReplies.find((r) => r.id === messageId)
    if (reply && reply.userId === "agent1@example.com") {
      setEditingMessageId(messageId)
      setEditedMessageContent(content)
      setEditedMessageAttachments(attachments || [])
    } else {
      console.log("You don't have permission to edit this message.")
      // Optionally, you can add a notification or alert here
    }
  }

  const handleSaveEdit = (messageId: string) => {
    console.log("Saving edited message:", messageId, editedMessageContent, editedMessageAttachments)
    const updatedReplies = ticketReplies.map(
      (
        reply, // Update: Use ticketReplies instead of replies
      ) =>
        reply.id === messageId
          ? { ...reply, content: editedMessageContent, attachments: editedMessageAttachments }
          : reply,
    )
    setTicketReplies(updatedReplies) // Update: Update ticketReplies state
    console.log("Updated replies:", updatedReplies)
    setEditingMessageId(null)
    setEditedMessageContent("")
    setEditedMessageAttachments([])
    addAuditEntry("Message Edited", `Message ${messageId} was edited`)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditedMessageContent("")
    setEditedMessageAttachments([])
  }

  const handleRemoveAttachment = (index: number) => {
    setEditedMessageAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const renderTagBadge = (label: string, value: string) => (
    <Badge variant="outline" className="mr-2">
      <span className="font-semibold mr-1">{label}:</span> {value}
    </Badge>
  )

  const calculatePriority = (severity: string, impact: string): TicketPriority => {
    const severityScore = { Low: 1, Medium: 2, High: 3, Critical: 4 }
    const impactScore = { Individual: 1, Department: 2, "Multiple Departments": 3, "Entire Organization": 4 }

    const score =
      severityScore[severity as keyof typeof severityScore] * impactScore[impact as keyof typeof impactScore]

    if (score >= 12) return "Urgent"
    if (score >= 8) return "High"
    if (score >= 4) return "Medium"
    return "Low"
  }

  return (
    <div className="flex space-x-4">
      <div className="w-[70%] space-y-4">
        <h2 className="text-2xl font-bold mb-2">{editedTicket.title}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {renderTagBadge("Priority", editedTicket.priority)}
          {renderTagBadge("Severity", editedTicket.severity)}
          {renderTagBadge("Impact", editedTicket.impact)}
        </div>
        <div className="space-y-4">
          {ticketReplies.map(
            (
              reply, // Update: Use ticketReplies instead of replies
            ) => (
              <div key={reply.id} className={`p-4 rounded-lg ${getReplyBackgroundColor(reply.type)}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{reply.userId}</span>
                  <span className="text-sm text-gray-500">{reply.createdAt.toLocaleString()}</span>
                </div>
                {editingMessageId === reply.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedMessageContent}
                      onChange={(e) => setEditedMessageContent(e.target.value)}
                      className="w-full"
                    />
                    <div>
                      <p className="font-semibold mb-1">Attachments:</p>
                      <ul className="list-disc pl-5">
                        {editedMessageAttachments.map((attachment, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span>
                              {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => handleSaveEdit(reply.id)} size="sm">
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{reply.content}</p>
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold mb-1">Attachments:</p>
                        <ul className="list-disc pl-5">
                          {reply.attachments.map((attachment, index) => (
                            <li key={index}>
                              {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">{reply.type}</p>
                      {reply.userId === "agent1@example.com" && (
                        <Button
                          onClick={() => handleEditMessage(reply.id, reply.content, reply.attachments || [])}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit2Icon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ),
          )}
        </div>
        <form onSubmit={handleReply} className="mt-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply here..."
            rows={4}
          />
          <div className="mt-2 flex justify-between items-center">
            <Select value={replyType} onValueChange={setReplyType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select reply type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UserReply">User Reply</SelectItem>
                <SelectItem value="AgentReply">Agent Reply</SelectItem>
                <SelectItem value="InternalComment">Internal Comment</SelectItem>
                <SelectItem value="ExternalComment">External Comment</SelectItem>
                <SelectItem value="DevelopmentComment">Development Comment</SelectItem>
                <SelectItem value="SuggestSolution">Suggest Solution</SelectItem>
                <SelectItem value="RequestInfo">Request Info</SelectItem>
                <SelectItem value="SystemMessage">System Message</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Input type="file" id="file-upload" className="w-full sm:w-auto" onChange={handleFileChange} multiple />
              <Button type="submit">Send Reply</Button>
            </div>
          </div>
          {attachments.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold mb-1">Attachments:</p>
              <ul className="list-disc pl-5">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
      <div className="w-[30%] space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="header-details">
            <AccordionTrigger>Header Details</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Input value={editedTicket.createdBy} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <Input value={editedTicket.jobTitle || "N/A"} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service</label>
                  <Input value={editedTicket.service} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input value={editedTicket.email || editedTicket.createdBy} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CC</label>
                  <Input value={editedTicket.cc?.join(", ") || "N/A"} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BCC</label>
                  <Input value={editedTicket.bcc?.join(", ") || "N/A"} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  {isEditing ? (
                    <Select value={editedTicket.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Needs more info">Needs more info</SelectItem>
                        <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                        <SelectItem value="Awaiting Internal Assistance">Awaiting Internal Assistance</SelectItem>
                        <SelectItem value="Awaiting 3rd Party feedback">Awaiting 3rd Party feedback</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Re-Opened">Re-Opened</SelectItem>
                        <SelectItem value="Assigned">Assigned</SelectItem>
                        <SelectItem value="Suggested Solution">Suggested Solution</SelectItem>
                        <SelectItem value="Contact replied">Contact replied</SelectItem>
                        <SelectItem value="Merged">Merged</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{editedTicket.status}</Badge>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ticket Title</label>
                  {isEditing ? (
                    <Input name="title" value={editedTicket.title} onChange={handleInputChange} />
                  ) : (
                    <Input value={editedTicket.title} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ticket #</label>
                  <Input value={editedTicket.number} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Created</label>
                  <Input value={new Date(editedTicket.createdAt).toLocaleString()} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  {isEditing ? (
                    <Select
                      value={editedTicket.mainCategory}
                      onValueChange={(value) => handleSelectChange("mainCategory", value)}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <Input value={editedTicket.mainCategory} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                  {isEditing ? (
                    <Select
                      value={editedTicket.subCategory}
                      onValueChange={(value) => handleSelectChange("subCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {editedTicket.mainCategory === "Bridgelink" &&
                          Object.values(BridgelinkSubCategory).map((subCat) => (
                            <SelectItem key={subCat} value={subCat}>
                              {subCat}
                            </SelectItem>
                          ))}
                        {editedTicket.mainCategory === "IT/System Support" &&
                          Object.values(ITSystemSupportSubCategory).map((subCat) => (
                            <SelectItem key={subCat} value={subCat}>
                              {subCat}
                            </SelectItem>
                          ))}
                        {editedTicket.mainCategory === "Training" &&
                          Object.values(TrainingSubCategory).map((subCat) => (
                            <SelectItem key={subCat} value={subCat}>
                              {subCat}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={editedTicket.subCategory || "N/A"} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  {isEditing ? (
                    <Input name="reason" value={editedTicket.reason || ""} onChange={handleInputChange} />
                  ) : (
                    <Input value={editedTicket.reason || "N/A"} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Agent</label>
                  {isEditing ? (
                    <Input name="assignedAgent" value={editedTicket.assignedAgent || ""} onChange={handleInputChange} />
                  ) : (
                    <Input value={editedTicket.assignedAgent || "Unassigned"} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Queue</label>
                  {isEditing ? (
                    <Input name="assignedQueue" value={editedTicket.assignedQueue || ""} onChange={handleInputChange} />
                  ) : (
                    <Input value={editedTicket.assignedQueue || "N/A"} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  {isEditing ? (
                    <Select
                      value={editedTicket.severity}
                      onValueChange={(value) => handleSelectChange("severity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={editedTicket.severity} readOnly />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Impact</label>
                  {isEditing ? (
                    <Select value={editedTicket.impact} onValueChange={(value) => handleSelectChange("impact", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Department">Department</SelectItem>
                        <SelectItem value="Multiple Departments">Multiple Departments</SelectItem>
                        <SelectItem value="Entire Organization">Entire Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={editedTicket.impact} readOnly />
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              ) : (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="description">
            <AccordionTrigger>Ticket Description</AccordionTrigger>
            <AccordionContent>
              {isEditing ? (
                <Textarea name="description" value={editedTicket.description} onChange={handleInputChange} rows={4} />
              ) : (
                <p className="whitespace-pre-wrap">{editedTicket.description}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

