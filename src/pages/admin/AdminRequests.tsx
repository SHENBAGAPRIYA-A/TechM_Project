
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { requestsAPI } from "@/services/api";
import { HelpdeskRequest, RequestStatus, RequestType, RequestPriority } from "@/types/helpdesk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Calendar, FileText, Filter, Loader2, Search } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminRequests = () => {
  const [requests, setRequests] = useState<HelpdeskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all-types");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [priorityFilter, setPriorityFilter] = useState<string>("all-priorities");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await requestsAPI.getRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const clearFilters = () => {
    setTypeFilter("all-types");
    setStatusFilter("all-statuses");
    setPriorityFilter("all-priorities");
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Apply filters and search
  const filteredRequests = requests.filter(request => {
    // Search by description, type, or student name
    const matchesSearch = searchQuery
      ? request.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        request.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      : true;

    // Filter by type
    const matchesType = typeFilter === "all-types"
      ? true
      : request.type === typeFilter;

    // Filter by status
    const matchesStatus = statusFilter === "all-statuses"
      ? true
      : request.status === statusFilter;
    
    // Filter by priority
    const matchesPriority = priorityFilter === "all-priorities"
      ? true
      : request.priority === priorityFilter;
    
    // Filter by tabs
    let matchesTab = true;
    if (activeTab === "urgent") {
      matchesTab = request.isUrgent === true;
    } else if (activeTab === "open") {
      matchesTab = request.status === "open" || request.status === "in-progress";
    } else if (activeTab === "closed") {
      matchesTab = request.status === "closed" || request.status === "resolved";
    }

    // Filter by date range
    let matchesDateRange = true;
    if (startDate || endDate) {
      const requestDate = new Date(request.createdAt);
      
      if (startDate && endDate) {
        matchesDateRange = requestDate >= startDate && requestDate <= endDate;
      } else if (startDate) {
        matchesDateRange = requestDate >= startDate;
      } else if (endDate) {
        matchesDateRange = requestDate <= endDate;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDateRange && matchesTab;
  });

  if (loading) {
    return (
      <Layout requireAuth requireAdmin>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  // Count for tabs
  const urgentCount = requests.filter(r => r.isUrgent === true).length;
  const openCount = requests.filter(r => r.status === "open" || r.status === "in-progress").length;
  const closedCount = requests.filter(r => r.status === "closed" || r.status === "resolved").length;

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Requests</h1>
          <p className="text-gray-600">View and manage all helpdesk requests</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full md:w-1/2">
            <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedCount})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({urgentCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Enhanced Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by keyword or student name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 md:w-3/5">
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Request Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="it">IT Support</SelectItem>
                    <SelectItem value="id-card">ID Card</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-4 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDateFilter(!showDateFilter)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Filter
                </Button>
                {(typeFilter !== "all-types" || statusFilter !== "all-statuses" || priorityFilter !== "all-priorities" || searchQuery || startDate || endDate) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2 md:mt-0">
                Showing {filteredRequests.length} of {requests.length} requests
              </div>
            </div>

            {/* Date Range Filter */}
            {showDateFilter && (
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <div className="w-full md:w-1/2">
                  <p className="mb-2 text-sm font-medium">Start Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="mb-2 text-sm font-medium">End Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requests list */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          request.status === 'resolved' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${request.priority === 'low' ? 'bg-gray-100 text-gray-800' : 
                          request.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                      {request.isUrgent && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                      </span>
                      {request.deadline && (
                        <span className="flex items-center text-xs text-amber-700">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {format(new Date(request.deadline), "MMM dd, yyyy")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-medium">{request.title || request.description.substring(0, 100)}{!request.title && request.description.length > 100 ? '...' : ''}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {request.studentName}
                      {request.department && ` - ${request.department}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      {request.createdAt !== request.updatedAt && 
                        ` • Updated ${formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}`}
                    </p>
                  </div>
                  <Link to={`/admin/requests/${request.id}`} className="text-sm text-helpdesk-600 hover:text-helpdesk-800">
                    Manage →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{requests.length === 0 ? "No requests have been submitted yet" : "No requests match your search criteria"}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminRequests;
