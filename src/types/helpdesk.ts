export type RequestPriority = "low" | "medium" | "high";
export type RequestStatus = "open" | "in-progress" | "resolved" | "closed";
export type RequestType = "maintenance" | "it" | "id-card" | "financial" | "academic" | "other";

export interface HelpdeskRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: RequestType;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  statusUpdates: StatusUpdate[];
  title?: string;
  department?: string;
  supportingDocuments?: string[];
  communicationPreference?: "email" | "phone" | "in-app";
  isUrgent?: boolean;
  deadline?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  rating?: number;
  feedback?: string;
  canBeReopened?: boolean;
}

export interface StatusUpdate {
  id: string;
  requestId: string;
  status: RequestStatus;
  comment: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "staff";
  message: string;
  timestamp: string;
  attachments?: string[];
  read?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  important: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  department?: string;
  studentId?: string;
  staffId?: string;
  contactInfo?: string;
  phone?: string;
  photo?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface ChartData {
  label: string;
  value: number;
}

export interface Report {
  totalRequests: number;
  openRequests: number;
  closedRequests: number;
  averageResolutionTimeInHours: number;
  requestsByType: ChartData[];
  requestsByPriority: ChartData[];
  requestsByMonth: ChartData[];
}
