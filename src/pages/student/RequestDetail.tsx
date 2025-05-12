import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { requestsAPI, chatAPI } from "@/services/api";
import { HelpdeskRequest, ChatMessage } from "@/types/helpdesk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Loader2, Send, Paperclip } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RequestDetail = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<HelpdeskRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat functionality
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // Check if the ticket is closed
  const isClosed = request?.status === "closed";

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await requestsAPI.getRequestById(requestId);

        if (!data) {
          setError("Request not found");
          return;
        }

        setRequest(data);
        
        // Fetch chat messages if the request exists
        try {
          const chatData = await chatAPI.getChatMessages(requestId);
          setMessages(chatData);
        } catch (err) {
          console.error("Failed to fetch chat messages:", err);
          // Don't set error for chat messages, just show the request
        }
      } catch (err) {
        console.error("Failed to fetch request details:", err);
        setError("Failed to load request details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!requestId || !newMessage.trim() || isSendingMessage || isClosed) return;

    setIsSendingMessage(true);
    try {
      const sentMessage = await chatAPI.sendMessage({
        requestId,
        senderId: "student", // Using student as the sender ID
        senderName: "John Doe", // This would come from authentication in a real app
        senderRole: "student",
        message: newMessage.trim()
      });
      
      // Update messages array without duplicating
      // The key fix is here - adding the message only once and checking if it exists
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === sentMessage.id);
        if (messageExists) return prev;
        return [...prev, sentMessage];
      });
      
      setNewMessage("");
      toast.success("Message sent");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isClosed) return;
    
    const file = e.target.files?.[0];
    if (!file || !requestId) return;

    try {
      toast.info("Uploading attachment...");
      const attachmentUrl = await chatAPI.uploadChatAttachment(requestId, file);
      
      // Send a message with the attachment
      const sentMessage = await chatAPI.sendMessage({
        requestId,
        senderId: "student",
        senderName: "John Doe", // This would come from authentication in a real app
        senderRole: "student",
        message: `Attached: ${file.name}`,
        attachments: [attachmentUrl]
      });
      
      // Add new message without duplication - same fix as above
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === sentMessage.id);
        if (messageExists) return prev;
        return [...prev, sentMessage];
      });
      
      toast.success("Attachment uploaded");
    } catch (err) {
      console.error("Failed to upload attachment:", err);
      toast.error("Failed to upload attachment. Please try again.");
    } finally {
      // Clear the file input
      if (chatFileInputRef.current) {
        chatFileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <Layout requireAuth>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  if (error || !request) {
    return (
      <Layout requireAuth>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Request not found"}</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  // Status badge styles
  const statusStyles = {
    open: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    closed: 'bg-green-100 text-green-800',
  };

  // Priority badge styles
  const priorityStyles = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
            <p className="text-gray-600">View your request status and updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[request.status]}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[request.priority]}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                      </span>
                    </div>
                    <CardTitle className="mt-2">
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                    </CardTitle>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(request.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-1 text-gray-700">{request.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Status Updates</h3>
                  <div className="space-y-4">
                    {request.statusUpdates.map((update, index) => (
                      <div key={`status-${update.id}-${index}`} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">
                            {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(update.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{update.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {update.updatedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Chat section */}
            <Card className="mt-6">
              <CardHeader className="border-b">
                <CardTitle>Support Chat</CardTitle>
                <CardDescription>
                  {isClosed 
                    ? "This request is closed. Chat is disabled."
                    : "Chat with support staff regarding your request"}
                </CardDescription>
              </CardHeader>
              
              {/* Messages container */}
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet. Start the conversation with support staff!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isStudent = msg.senderRole === 'student';
                    return (
                      <div
                        key={`chat-${msg.id}-${index}`}
                        className={`mb-4 flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isStudent && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarFallback className="bg-primary-purple text-white">
                              {msg.senderName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[80%] px-4 py-2 rounded-lg
                          ${isStudent 
                            ? 'bg-primary-purple text-white' 
                            : 'bg-gray-100 text-gray-800'}`
                        }>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mb-2">
                              {msg.attachments.map((attachment, i) => (
                                <a 
                                  key={`attachment-${msg.id}-${i}`}
                                  href={attachment}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`block text-sm ${isStudent ? 'text-blue-100' : 'text-blue-600'} hover:underline mb-1`}
                                >
                                  {attachment.split('/').pop()}
                                </a>
                              ))}
                            </div>
                          )}
                          <p>{msg.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs ${isStudent ? 'text-blue-100' : 'text-gray-500'}`}>
                              {msg.senderName}
                            </span>
                            <span className={`text-xs ${isStudent ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        {isStudent && (
                          <Avatar className="h-8 w-8 ml-2 mt-1">
                            <AvatarFallback className="bg-soft-purple text-dark-purple">
                              J
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              {/* Chat input */}
              <CardFooter className="p-4 border-t">
                <div className="flex w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => chatFileInputRef.current?.click()}
                    className="mr-2"
                    disabled={isClosed}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={chatFileInputRef}
                    onChange={handleUploadAttachment}
                    className="hidden"
                    disabled={isClosed}
                  />
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isClosed ? "Chat disabled for closed requests" : "Type your message..."}
                    className="flex-1"
                    disabled={isClosed}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isClosed) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSendingMessage || isClosed}
                    className="ml-2"
                  >
                    {isSendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Request info sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Request ID</h4>
                  <p className="mt-1">{request.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Submitted On</h4>
                  <p className="mt-1">{format(new Date(request.createdAt), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Type</h4>
                  <p className="mt-1 capitalize">{request.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Current Status</h4>
                  <p className="mt-1 capitalize">{request.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Priority</h4>
                  <p className="mt-1 capitalize">{request.priority}</p>
                </div>
                {request.assignedStaffId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
                    <p className="mt-1">{request.assignedStaffName}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestDetail;
