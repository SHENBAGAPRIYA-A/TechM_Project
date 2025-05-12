
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { requestsAPI } from "@/services/api";
import { HelpdeskRequest, RequestStatus, RequestType } from "@/types/helpdesk";
import RequestCard from "@/components/dashboard/RequestCard";
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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const StudentRequestList = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpdeskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all-types");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await requestsAPI.getRequests(user?.id);
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRequests();
    }
  }, [user?.id]);

  const clearFilters = () => {
    setTypeFilter("all-types");
    setStatusFilter("all-statuses");
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Apply filters and search
  const filteredRequests = requests.filter(request => {
    // Search by title or description or type
    const matchesSearch = searchQuery
      ? (request.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         request.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
         request.type.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    // Filter by type
    const matchesType = typeFilter === "all-types"
      ? true
      : request.type === typeFilter;

    // Filter by status
    const matchesStatus = statusFilter === "all-statuses"
      ? true
      : request.status === statusFilter;

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

    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  // Get array of unique request types from data
  const requestTypes = [...new Set(requests.map(r => r.type))];
  
  // Get array of unique request statuses from data
  const requestStatuses = [...new Set(requests.map(r => r.status))];

  if (loading) {
    return (
      <Layout requireAuth>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Requests</h1>
            <p className="text-gray-600">Track and manage all your helpdesk requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/new-request">
              <Button className="helpdesk-gradient">
                <FileText className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description or type..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:w-2/5">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    {requestTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    {requestStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
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
                {(typeFilter !== "all-types" || statusFilter !== "all-statuses" || searchQuery || startDate || endDate) && (
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
              <RequestCard key={request.id} request={request} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {requests.length === 0
                  ? "You haven't submitted any requests yet"
                  : "No requests match your search criteria"}
              </p>
              {requests.length === 0 && (
                <Link to="/new-request">
                  <Button>Submit Your First Request</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentRequestList;
