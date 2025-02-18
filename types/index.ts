export type TicketPriority = "Low" | "Medium" | "High" | "Urgent"
export type TicketStatus =
  | "New"
  | "Needs more info"
  | "Under Investigation"
  | "Awaiting Internal Assistance"
  | "Awaiting 3rd Party feedback"
  | "Resolved"
  | "Re-Opened"
  | "Assigned"
  | "Suggested Solution"
  | "Contact replied"
  | "Merged"

export type TicketMainCategory =
  | "Bridgelink"
  | "IT/System Support"
  | "Asset Register"
  | "Training"
  | "Development"
  | "Uncategorized"

export const BridgelinkSubCategory = {
  ActivityStream: "Activity Stream",
  Admissions: "Admissions",
  BridgeLinkAccess: "BridgeLink Access",
  Accident: "Accident",
  Injury: "Injury",
  NearMiss: "Near Miss",
  Estates: "Estates",
  GroupQualityAssuranceAudit: "Group Quality Assurance Audit",
  Groups: "Groups",
  HealthAndSafetySystem: "Health and Safety System",
  Leaver: "Leaver",
  MeetingMinutes: "Meeting Minutes",
  NewStarter: "New Starter",
  OneForm: "One Form",
  Planning: "Planning",
  PurchaseOrders: "Purchase Orders",
  QualityAssurance: "Quality Assurance",
  RiskManagement: "Risk Management",
  SchoolFeedback: "School Feedback",
  SchoolQualityAssuranceAudit: "School Quality Assurance Audit",
  Services: "Services",
  StaffLowLevelConcern: "Staff Low Level Concern",
  StudentProfiles: "Student Profiles",
  SuggestionsRequests: "Suggestions/Requests",
  Understanding: "Understanding",
  WorkflowInbox: "Workflow Inbox",
} as const

export const ITSystemSupportSubCategory = {
  Google: "Google",
  InternetWiFi: "Internet/WiFi",
  NetworkAndInfrastructure: "Network and Infrastructure",
  Printing: "Printing",
  Security: "Security",
  WebsiteAccess: "Website Access",
  Microsoft: "Microsoft",
  Assets: "Assets",
  FilesAndStorage: "Files and Storage",
  Helpdesk: "Helpdesk",
  HowDoI: "How Do I?",
  News: "News",
  Phones: "Phones",
} as const

export const TrainingSubCategory = {
  ELearningCourses: "e-Learning Courses",
  MyELearningDashboard: "My e-Learning Dashboard",
  SkillsLandingPage: "Skills Landing Page",
} as const

export type BridgelinkSubCategoryType = (typeof BridgelinkSubCategory)[keyof typeof BridgelinkSubCategory]
export type ITSystemSupportSubCategoryType =
  (typeof ITSystemSupportSubCategory)[keyof typeof ITSystemSupportSubCategory]
export type TrainingSubCategoryType = (typeof TrainingSubCategory)[keyof typeof TrainingSubCategory]

export type TicketSubCategory = BridgelinkSubCategoryType | ITSystemSupportSubCategoryType | TrainingSubCategoryType

export interface Ticket {
  id: string
  number: string
  priority: TicketPriority
  mainCategory: TicketMainCategory
  subCategory?: TicketSubCategory
  title: string
  description: string
  status: TicketStatus
  assignedAgent?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  lastReplyBy: string
  lastReplyAt: Date
  lastUpdatedAt: Date
  cc: string[]
  bcc: string[]
  service: string
}

export type UserRole = "EndUser" | "Agent" | "SeniorAgent"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface TicketReply {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  type: "UserReply" | "AgentReply" | "InternalComment" | "ExternalComment" | "DevelopmentComment"
}

export type EmailTemplateType = "TicketCreated" | "TicketUpdated" | "TicketOverdue" | "AgentReply" | "UserReply"

export interface EmailTemplate {
  id: string
  name: string
  type: EmailTemplateType
  subject: string
  body: string
}

