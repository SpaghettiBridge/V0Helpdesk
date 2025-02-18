import type React from "react"
import { useState, useEffect } from "react"
import type { Ticket, User } from "../../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, ArrowUpDown, Trash2 } from "lucide-react"
import { SubmitTicketModal } from "./SubmitTicketModal"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { TicketDetailDrawer } from "../../components/TicketDetailDrawer"
import { exportToCSV } from "../../utils/csvExport"
import { MergeTicketsModal } from "./MergeTicketsModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface TicketListProps {
  tickets: Ticket[]
  currentUser: User
  onCreateTicket: (ticketData: any) => void
  onBulkEdit: (action: string, value: string, selectedTickets: string[]) => void
  onMergeTickets: (mainTicketId: string, mergedTicketIds: string[]) => void
  onDeleteTicket: (ticketId: string) => void
  onTicketClick?: (ticketId: string) => void
}

type SortConfig = {
  key: keyof Ticket
  direction: "ascending" | "descending"
} | null

export default function TicketList({
  tickets,
  currentUser,
  onCreateTicket,
  onBulkEdit,
  onMergeTickets,
  onDeleteTicket,
  onTicketClick,
}: TicketListProps) {
  const [filteredTickets, setFilteredTickets] = useState(tickets)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [bulkMessage, setBulkMessage] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    mainCategory: "",
    subCategory: "",
    ticketNumber: "",
    title: "",
    description: "",
    createdBy: "",
    assignedAgent: "",
    startDate: "",
    endDate: "",
    awaitingReply: "",
    service: "all",
  })
  const [userTickets, setUserTickets] = useState<Ticket[]>([])
  const [isUserTicketsModalOpen, setIsUserTicketsModalOpen] = useState(false)
  const [showClosedTickets, setShowClosedTickets] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)

  const fetchUserTickets = (userId: string) => {
    const tickets = filteredTickets.filter((ticket) => ticket.createdBy === userId)
    setUserTickets(tickets)
    setIsUserTicketsModalOpen(true)
  }

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const newFilteredTickets = tickets.filter(
      (ticket) =>
        (!filters.priority || ticket.priority === filters.priority) &&
        (!filters.status || ticket.status === filters.status) &&
        (!filters.mainCategory || ticket.mainCategory === filters.mainCategory) &&
        (!filters.subCategory || ticket.subCategory === filters.subCategory) &&
        (!filters.ticketNumber || ticket.number.toLowerCase().includes(filters.ticketNumber.toLowerCase())) &&
        (!filters.title || ticket.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (!filters.description || ticket.description.toLowerCase().includes(filters.description.toLowerCase())) &&
        (!filters.createdBy || ticket.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) &&
        (!filters.assignedAgent ||
          (ticket.assignedAgent || "").toLowerCase().includes(filters.assignedAgent.toLowerCase())) &&
        (!filters.startDate || new Date(ticket.createdAt) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(ticket.createdAt) <= new Date(filters.endDate)) &&
        (!filters.awaitingReply || getAwaitingReply(ticket) === filters.awaitingReply) &&
        (filters.service === "all" || ticket.service === filters.service) &&
        (showClosedTickets || ticket.status !== "Closed"),
    )

    if (sortConfig !== null) {
      newFilteredTickets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredTickets(newFilteredTickets)
  }, [filters, sortConfig, tickets, showClosedTickets])

  const getAwaitingReply = (ticket: Ticket) => {
    if (ticket.status === "Closed" || ticket.status === "Resolved") {
      return "None"
    }
    return ticket.lastReplyBy === ticket.createdBy ? "Agent" : "User"
  }

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id))
    } else {
      setSelectedTickets([])
    }
  }

  const handleTicketSelect = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets((prev) => [...prev, ticketId])
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId))
    }
  }

  const handleBulkAction = (action: string, value: string) => {
    onBulkEdit(action, value, selectedTickets)
    setSelectedTickets([])
  }

  const handleBulkMessage = () => {
    onBulkEdit("sendMessage", bulkMessage, selectedTickets)
    setBulkMessage("")
    setSelectedTickets([])
  }

  const router = useRouter()

  const handleTicketClick = (ticket: Ticket) => {
    if (onTicketClick) {
      onTicketClick(ticket.id)
    } else {
      router.push(`/tickets/${ticket.id}`)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedTicket(null)
  }

  const handleReply = (content: string, type: string) => {
    console.log("Reply submitted:", content, type)
    // In a real application, you would send this to your API and update the ticket
  }

  const handleAction = (action: string, value?: string) => {
    console.log("Action performed:", action, value)
    if (action === "viewUserTickets" && value) {
      fetchUserTickets(value)
    }
    // In a real application, you would send this to your API and update the ticket
  }

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setFilteredTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
    // If you have a separate state for the selected ticket, update it as well
    if (selectedTicket && selectedTicket.id === updatedTicket.id) {
      setSelectedTicket(updatedTicket)
    }
  }

  const handleExportCSV = () => {
    exportToCSV(filteredTickets, "tickets_export", filters.startDate, filters.endDate)
  }

  const isOverdue = (ticket: Ticket) => {
    const now = new Date()
    const lastUpdated = new Date(ticket.lastUpdatedAt)
    const diffTime = Math.abs(now.getTime() - lastUpdated.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 3
  }

  const handleMergeTickets = (mainTicketId: string) => {
    const mergedTicketIds = selectedTickets.filter((id) => id !== mainTicketId)
    onMergeTickets(mainTicketId, mergedTicketIds)
    setSelectedTickets([])
  }

  const handleSort = (key: keyof Ticket) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const renderSortIcon = (key: keyof Ticket) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  const handleDeleteTicket = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTicketToDelete(ticketId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (ticketToDelete) {
      onDeleteTicket(ticketToDelete)
      setFilteredTickets((prev) => prev.filter((ticket) => ticket.id !== ticketToDelete))
      setIsDeleteModalOpen(false)
      setTicketToDelete(null)
    }
  }

  const handleCreateTicket = (ticketData: any) => {
    onCreateTicket(ticketData)
  }

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
      title: "Issue with student registration",
      description:
        "I'm having trouble registering a new student in the Bridgelink system. When I try to submit the registration form, I get an error message saying 'Invalid date format'. I've double-checked all the dates, and they seem to be in the correct format (DD/MM/YYYY). This is preventing me from completing the registration process for a new student starting next term.",
      status: "In Progress",
      createdBy: "teacher@example.com",
      assignedAgent: "agent2@example.com",
      createdAt: new Date("2023-06-02T14:30:00"),
      updatedAt: new Date("2023-06-02T15:30:00"),
      lastReplyBy: "agent2@example.com",
      lastReplyAt: new Date("2023-06-02T15:30:00"),
      lastUpdatedAt: new Date("2023-06-02T15:30:00"),
      cc: ["admissions@example.com"],
      bcc: [],
      service: "Preston Bridge School",
    },
    {
      id: "3",
      number: "TICK-003",
      priority: "Low",
      mainCategory: "Asset Register",
      subCategory: "Hardware",
      title: "Request for new laptop",
      description:
        "I would like to request a new laptop for my work. My current laptop (Asset ID: LP-2018-045) is over 4 years old and has been experiencing frequent slowdowns and crashes. This is affecting my productivity, especially when working with large spreadsheets and attending video conferences. I would appreciate a newer model with better performance to help me carry out my duties more efficiently.",
      status: "Open",
      createdBy: "staff@example.com",
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
      subCategory: "Network",
      title: "Internet connection down",
      description:
        "The entire school is experiencing internet connectivity issues. Our Wi-Fi network 'SchoolNet' is not showing up on any devices, and the wired connections in the computer labs are also not working. This is severely impacting our ability to conduct classes, access online resources, and perform administrative tasks. We have a virtual parent-teacher conference scheduled for this afternoon, which we won't be able to host without internet access. Please treat this as an urgent matter.",
      status: "In Progress",
      createdBy: "principal@example.com",
      assignedAgent: "agent3@example.com",
      createdAt: new Date("2023-06-04T16:45:00"),
      updatedAt: new Date("2023-06-04T17:45:00"),
      lastReplyBy: "agent3@example.com",
      lastReplyAt: new Date("2023-06-04T17:45:00"),
      lastUpdatedAt: new Date("2023-06-04T17:45:00"),
      cc: ["itdepartment@example.com", "teachingstaff@example.com"],
      bcc: [],
      service: "Chilton Bridge School",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#00697F] font-josefin-sans">Tickets</h2>
        <div className="flex space-x-2 items-center">
          <SubmitTicketModal onCreateTicket={handleCreateTicket} />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showClosedTickets"
              checked={showClosedTickets}
              onCheckedChange={(checked) => setShowClosedTickets(checked as boolean)}
            />
            <label
              htmlFor="showClosedTickets"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Closed Tickets
            </label>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="bg-[#00697F] text-white hover:bg-[#005A6E]">
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2" disabled={selectedTickets.length === 0}>
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleBulkAction("changeStatus", "Open")}>Set to Open</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleBulkAction("changeStatus", "In Progress")}>
                Set to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleBulkAction("changeStatus", "Resolved")}>
                Set to Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleBulkAction("changeStatus", "Closed")}>
                Set to Closed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Other Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Send Message</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Bulk Message</DialogTitle>
                    <DialogDescription>This message will be sent to all selected tickets.</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Type your message here..."
                  />
                  <DialogFooter>
                    <Button onClick={handleBulkMessage}>Send Message</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onSelect={() => setIsMergeModalOpen(true)}>Merge Tickets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          variant="outline"
          className="w-full justify-between"
        >
          Filters
          {isFilterExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isFilterExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => handleFilterChange("priority", value)} value={filters.priority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ticketNumber">Ticket Number</Label>
              <Input
                id="ticketNumber"
                value={filters.ticketNumber}
                onChange={(e) => handleFilterChange("ticketNumber", e.target.value)}
                placeholder="Enter ticket number"
              />
            </div>
            <div>
              <Label htmlFor="createdBy">End User</Label>
              <Input
                id="createdBy"
                value={filters.createdBy}
                onChange={(e) => handleFilterChange("createdBy", e.target.value)}
                placeholder="Enter end user's email"
              />
            </div>
            <div>
              <Label htmlFor="mainCategory">Category</Label>
              <Select onValueChange={(value) => handleFilterChange("mainCategory", value)} value={filters.mainCategory}>
                <SelectTrigger id="mainCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Bridgelink">Bridgelink</SelectItem>
                  <SelectItem value="IT/System Support">IT/System Support</SelectItem>
                  <SelectItem value="Asset Register">Asset Register</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={filters.description}
                onChange={(e) => handleFilterChange("description", e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleFilterChange("status", value)} value={filters.status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
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
            </div>
            <div>
              <Label htmlFor="startDate">Date Created (From)</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date Created (To)</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="awaitingReply">Awaiting Reply</Label>
              <Select
                onValueChange={(value) => handleFilterChange("awaitingReply", value)}
                value={filters.awaitingReply}
              >
                <SelectTrigger id="awaitingReply">
                  <SelectValue placeholder="Select who needs to reply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedTickets.length === filteredTickets.length}
                  onCheckedChange={handleSelectAllChange}
                />
              </TableHead>
              <TableHead className="w-[80px]">
                <Button variant="ghost" onClick={() => handleSort("number")}>
                  Number {renderSortIcon("number")}
                </Button>
              </TableHead>
              <TableHead className="w-[80px]">
                <Button variant="ghost" onClick={() => handleSort("priority")}>
                  Priority {renderSortIcon("priority")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("createdBy")}>
                  End User {renderSortIcon("createdBy")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("mainCategory")}>
                  Category {renderSortIcon("mainCategory")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("title")}>
                  Title {renderSortIcon("title")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("description")}>
                  Description {renderSortIcon("description")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status {renderSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" onClick={() => handleSort("createdAt")}>
                  Date Created {renderSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">Awaiting Reply</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className={`cursor-pointer hover:bg-gray-100 ${isOverdue(ticket) ? "bg-red-50" : ""}`}
                onClick={() => handleTicketClick(ticket)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) => handleTicketSelect(ticket.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>{ticket.number}</TableCell>
                <TableCell>
                  <Badge variant={ticket.priority === "High" ? "destructive" : "default"}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.mainCategory}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  {ticket.description.length > 50 ? `${ticket.description.substring(0, 50)}...` : ticket.description}
                </TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getAwaitingReply(ticket) === "Agent" ? "destructive" : "default"}>
                    {getAwaitingReply(ticket)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteTicket(ticket.id, e)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total tickets: {filteredTickets.length} {!showClosedTickets && "(excluding closed tickets)"}
      </div>

      <TicketDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        ticket={selectedTicket}
        replies={[]}
        currentUser={currentUser}
        onReply={handleReply}
        onAction={handleAction}
        onUpdate={handleTicketUpdate}
      />

      <MergeTicketsModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        selectedTickets={filteredTickets.filter((ticket) => selectedTickets.includes(ticket.id))}
        onMerge={handleMergeTickets}
      />
      <Dialog open={isUserTicketsModalOpen} onOpenChange={setIsUserTicketsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User's Tickets</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <TableCell>{ticket.number}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

