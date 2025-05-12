
import { Announcement, HelpdeskRequest, Report } from "@/types/helpdesk";

export const mockRequests: HelpdeskRequest[] = [
  {
    id: "req-001",
    studentId: "student1",
    studentName: "John Smith",
    type: "maintenance",
    description: "Broken chair in classroom 101",
    priority: "medium",
    status: "open",
    createdAt: "2025-05-01T10:30:00Z",
    updatedAt: "2025-05-01T10:30:00Z",
    statusUpdates: [
      {
        id: "update-001",
        requestId: "req-001",
        status: "open",
        comment: "Request received and assigned to maintenance team",
        updatedAt: "2025-05-01T10:30:00Z",
        updatedBy: "System"
      }
    ]
  },
  {
    id: "req-002",
    studentId: "student1",
    studentName: "John Smith",
    type: "it",
    description: "Cannot access the college WiFi network",
    priority: "high",
    status: "in-progress",
    createdAt: "2025-04-28T14:15:00Z",
    updatedAt: "2025-05-01T09:20:00Z",
    statusUpdates: [
      {
        id: "update-002",
        requestId: "req-002",
        status: "open",
        comment: "Request received",
        updatedAt: "2025-04-28T14:15:00Z",
        updatedBy: "System"
      },
      {
        id: "update-003",
        requestId: "req-002",
        status: "in-progress",
        comment: "IT team is investigating the issue with the WiFi network",
        updatedAt: "2025-05-01T09:20:00Z",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "req-003",
    studentId: "student1",
    studentName: "John Smith",
    type: "id-card",
    description: "Lost my student ID card and need a replacement",
    priority: "medium",
    status: "closed",
    createdAt: "2025-04-20T11:00:00Z",
    updatedAt: "2025-04-22T15:30:00Z",
    statusUpdates: [
      {
        id: "update-004",
        requestId: "req-003",
        status: "open",
        comment: "Request received",
        updatedAt: "2025-04-20T11:00:00Z",
        updatedBy: "System"
      },
      {
        id: "update-005",
        requestId: "req-003",
        status: "in-progress",
        comment: "New ID card is being prepared",
        updatedAt: "2025-04-21T09:15:00Z",
        updatedBy: "Admin User"
      },
      {
        id: "update-006",
        requestId: "req-003",
        status: "closed",
        comment: "New ID card has been issued. Please collect from the admin office",
        updatedAt: "2025-04-22T15:30:00Z",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "req-004",
    studentId: "student2",
    studentName: "Jane Doe",
    type: "financial",
    description: "Question about scholarship payment schedule",
    priority: "low",
    status: "closed",
    createdAt: "2025-04-15T10:00:00Z",
    updatedAt: "2025-04-16T14:20:00Z",
    statusUpdates: [
      {
        id: "update-007",
        requestId: "req-004",
        status: "open",
        comment: "Request received",
        updatedAt: "2025-04-15T10:00:00Z",
        updatedBy: "System"
      },
      {
        id: "update-008",
        requestId: "req-004",
        status: "closed",
        comment: "Information provided about scholarship payment schedule via email",
        updatedAt: "2025-04-16T14:20:00Z",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "req-005",
    studentId: "student3",
    studentName: "Michael Johnson",
    type: "academic",
    description: "Need help with course registration for next semester",
    priority: "medium",
    status: "open",
    createdAt: "2025-05-02T09:45:00Z",
    updatedAt: "2025-05-02T09:45:00Z",
    statusUpdates: [
      {
        id: "update-009",
        requestId: "req-005",
        status: "open",
        comment: "Request received and forwarded to academic advisors",
        updatedAt: "2025-05-02T09:45:00Z",
        updatedBy: "System"
      }
    ]
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    title: "Campus WiFi Maintenance",
    content: "The campus WiFi network will be undergoing maintenance this Saturday from 2 AM to 6 AM. During this time, you may experience connectivity issues.",
    important: true,
    createdAt: "2025-05-01T14:00:00Z",
    createdBy: "IT Department"
  },
  {
    id: "ann-002",
    title: "Library Extended Hours",
    content: "The library will have extended hours during finals week, staying open until midnight from May 15-22.",
    important: false,
    createdAt: "2025-04-28T10:15:00Z",
    createdBy: "Library Services"
  },
  {
    id: "ann-003",
    title: "Student ID Card Renewal",
    content: "All students are reminded to renew their ID cards for the upcoming academic year. Please visit the admin office with your current ID card.",
    important: true,
    createdAt: "2025-04-25T11:30:00Z",
    createdBy: "Administrative Office"
  },
  {
    id: "ann-004",
    title: "New Online Payment System",
    content: "We've upgraded our payment system. You can now pay tuition and fees through the new student portal, which offers more payment options and improved security.",
    important: false,
    createdAt: "2025-04-20T09:00:00Z",
    createdBy: "Finance Department"
  }
];

export const mockReport: Report = {
  totalRequests: 42,
  openRequests: 15,
  closedRequests: 27,
  averageResolutionTimeInHours: 36.5,
  requestsByType: [
    { label: "Maintenance", value: 12 },
    { label: "IT", value: 15 },
    { label: "ID Card", value: 5 },
    { label: "Financial", value: 4 },
    { label: "Academic", value: 4 },
    { label: "Other", value: 2 }
  ],
  requestsByPriority: [
    { label: "Low", value: 10 },
    { label: "Medium", value: 22 },
    { label: "High", value: 10 }
  ],
  requestsByMonth: [
    { label: "Jan", value: 5 },
    { label: "Feb", value: 4 },
    { label: "Mar", value: 6 },
    { label: "Apr", value: 12 },
    { label: "May", value: 15 }
  ]
};
