
import { Announcement, ChatMessage, HelpdeskRequest, Profile, Report, RequestPriority, RequestStatus, RequestType } from "@/types/helpdesk";
import { mockAnnouncements, mockReport, mockRequests } from "@/data/mockData";

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base mock API class
class MockAPI {
  protected async simulateRequest<T>(data: T, errorChance = 0): Promise<T> {
    // Simulate network delay
    await delay(500);
    
    // Simulate random errors if errorChance > 0
    if (errorChance > 0 && Math.random() < errorChance) {
      throw new Error("API request failed");
    }
    
    return data;
  }
}

// Mock chat messages
const mockChatMessages: Record<string, ChatMessage[]> = {};

// Requests API service
class RequestsAPI extends MockAPI {
  // Get all requests (for admin) or filtered by studentId (for students)
  async getRequests(studentId?: string): Promise<HelpdeskRequest[]> {
    let filteredRequests = [...mockRequests];
    
    if (studentId) {
      filteredRequests = filteredRequests.filter(request => request.studentId === studentId);
    }
    
    return this.simulateRequest(filteredRequests);
  }
  
  // Get a single request by ID
  async getRequestById(id: string): Promise<HelpdeskRequest | null> {
    const request = mockRequests.find(request => request.id === id) || null;
    
    // Check if request can be reopened (within 7 days of being closed)
    if (request && request.status === 'closed') {
      const closedUpdate = request.statusUpdates.find(update => update.status === 'closed');
      if (closedUpdate) {
        const closedDate = new Date(closedUpdate.updatedAt);
        const now = new Date();
        const daysDifference = Math.floor((now.getTime() - closedDate.getTime()) / (1000 * 3600 * 24));
        request.canBeReopened = daysDifference <= 7;
      }
    }
    
    return this.simulateRequest(request);
  }
  
  // Create a new request
  async createRequest(request: Omit<HelpdeskRequest, 'id' | 'createdAt' | 'updatedAt' | 'statusUpdates'>): Promise<HelpdeskRequest> {
    const now = new Date().toISOString();
    
    const newRequest: HelpdeskRequest = {
      id: `req-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now,
      statusUpdates: [
        {
          id: `update-${Math.floor(Math.random() * 1000)}`,
          requestId: `req-${Math.floor(Math.random() * 1000)}`,
          status: 'open',
          comment: 'Request received',
          updatedAt: now,
          updatedBy: 'System'
        }
      ],
      ...request
    };
    
    // In a real app, we would persist this
    mockRequests.push(newRequest);
    
    return this.simulateRequest(newRequest);
  }
  
  // Update request status
  async updateRequestStatus(id: string, status: RequestStatus, comment: string): Promise<HelpdeskRequest> {
    const request = mockRequests.find(request => request.id === id);
    
    if (!request) {
      throw new Error(`Request with ID ${id} not found`);
    }
    
    const now = new Date().toISOString();
    
    // Update the request
    request.status = status;
    request.updatedAt = now;
    
    // Add a status update
    request.statusUpdates.push({
      id: `update-${Math.floor(Math.random() * 1000)}`,
      requestId: id,
      status,
      comment,
      updatedAt: now,
      updatedBy: 'Admin User' // In a real app, this would come from the authenticated user
    });
    
    return this.simulateRequest(request);
  }
  
  // Reopen a closed request (within 7 days)
  async reopenRequest(id: string, comment: string): Promise<HelpdeskRequest> {
    const request = await this.getRequestById(id);
    
    if (!request) {
      throw new Error(`Request with ID ${id} not found`);
    }
    
    if (!request.canBeReopened) {
      throw new Error(`Request with ID ${id} cannot be reopened (past 7 days)`);
    }
    
    return this.updateRequestStatus(id, 'open', comment);
  }
  
  // Submit rating and feedback for a resolved request
  async submitFeedback(id: string, rating: number, feedback: string): Promise<HelpdeskRequest> {
    const request = mockRequests.find(request => request.id === id);
    
    if (!request) {
      throw new Error(`Request with ID ${id} not found`);
    }
    
    if (request.status !== 'resolved' && request.status !== 'closed') {
      throw new Error(`Can only provide feedback for resolved or closed requests`);
    }
    
    // Update the request with rating and feedback
    request.rating = rating;
    request.feedback = feedback;
    
    return this.simulateRequest(request);
  }
  
  // Filter requests
  async filterRequests(filters: { type?: RequestType; status?: RequestStatus; priority?: RequestPriority }): Promise<HelpdeskRequest[]> {
    let filteredRequests = [...mockRequests];
    
    if (filters.type) {
      filteredRequests = filteredRequests.filter(request => request.type === filters.type);
    }
    
    if (filters.status) {
      filteredRequests = filteredRequests.filter(request => request.status === filters.status);
    }
    
    if (filters.priority) {
      filteredRequests = filteredRequests.filter(request => request.priority === filters.priority);
    }
    
    return this.simulateRequest(filteredRequests);
  }
}

// Chat API service
class ChatAPI extends MockAPI {
  // Get chat messages for a request
  async getChatMessages(requestId: string): Promise<ChatMessage[]> {
    if (!mockChatMessages[requestId]) {
      mockChatMessages[requestId] = [];
    }
    
    return this.simulateRequest(mockChatMessages[requestId]);
  }
  
  // Send a chat message
  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const now = new Date().toISOString();
    
    const newMessage: ChatMessage = {
      id: `msg-${Math.floor(Math.random() * 10000)}`,
      timestamp: now,
      ...message
    };
    
    if (!mockChatMessages[message.requestId]) {
      mockChatMessages[message.requestId] = [];
    }
    
    mockChatMessages[message.requestId].push(newMessage);
    
    return this.simulateRequest(newMessage);
  }
  
  // Upload a file attachment to a chat
  async uploadChatAttachment(requestId: string, file: File): Promise<string> {
    // In a real app, this would upload the file to storage
    // Here we just return a mock URL
    await delay(1000); // Simulate upload time
    
    const mockUrl = `https://example.com/attachments/${file.name}`;
    return this.simulateRequest(mockUrl);
  }
}

// Announcements API service
class AnnouncementsAPI extends MockAPI {
  // Get all announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.simulateRequest([...mockAnnouncements]);
  }
  
  // Create a new announcement (admin only)
  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
    const now = new Date().toISOString();
    
    const newAnnouncement: Announcement = {
      id: `ann-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      ...announcement
    };
    
    // In a real app, we would persist this
    mockAnnouncements.push(newAnnouncement);
    
    return this.simulateRequest(newAnnouncement);
  }
  
  // Delete an announcement (admin only)
  async deleteAnnouncement(id: string): Promise<void> {
    const index = mockAnnouncements.findIndex(announcement => announcement.id === id);
    
    if (index === -1) {
      throw new Error(`Announcement with ID ${id} not found`);
    }
    
    mockAnnouncements.splice(index, 1);
    
    return this.simulateRequest(undefined);
  }
}

// Profile API service
class ProfileAPI extends MockAPI {
  // Get user profile
  async getProfile(userId: string): Promise<Profile> {
    // In a real app, this would fetch from a database
    const profile: Profile = {
      id: userId,
      name: "John Smith",
      email: "john.smith@college.edu",
      department: "Computer Science",
      studentId: "CS12345",
      contactInfo: "john.smith@college.edu"
    };
    
    return this.simulateRequest(profile);
  }
  
  // Update user profile
  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    // In a real app, this would update the database
    const updatedProfile: Profile = {
      id: userId,
      name: profileData.name || "John Smith",
      email: profileData.email || "john.smith@college.edu",
      department: profileData.department || "Computer Science",
      studentId: profileData.studentId || "CS12345",
      contactInfo: profileData.contactInfo || "john.smith@college.edu"
    };
    
    return this.simulateRequest(updatedProfile);
  }
}

// Reports API service (admin only)
class ReportsAPI extends MockAPI {
  // Get dashboard reports
  async getReports(): Promise<Report> {
    return this.simulateRequest(mockReport);
  }
}

// Export API services
export const requestsAPI = new RequestsAPI();
export const announcementsAPI = new AnnouncementsAPI();
export const profileAPI = new ProfileAPI();
export const reportsAPI = new ReportsAPI();
export const chatAPI = new ChatAPI();
