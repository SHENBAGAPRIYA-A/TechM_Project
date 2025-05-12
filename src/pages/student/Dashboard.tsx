
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { requestsAPI, announcementsAPI } from "@/services/api";
import { Announcement, HelpdeskRequest } from "@/types/helpdesk";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import RequestCard from "@/components/dashboard/RequestCard";
import StatCard from "@/components/dashboard/StatCard";
import { Check, FileText, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [requests, setRequests] = useState<HelpdeskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch announcements and requests in parallel
        const [announcementsData, requestsData] = await Promise.all([
          announcementsAPI.getAnnouncements(),
          requestsAPI.getRequests(user?.id),
        ]);
        
        setAnnouncements(announcementsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  // Calculate statistics
  const openRequests = requests.filter(req => req.status !== 'closed').length;
  const closedRequests = requests.filter(req => req.status === 'closed').length;

  // Filter requests based on search query
  const filteredRequests = requests.filter(request => 
    request.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort announcements to show important ones first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Here's an overview of your helpdesk requests and announcements</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/new-request">
              <Button className="helpdesk-gradient">New Request</Button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Requests" 
            value={requests.length} 
            icon={<FileText size={24} />} 
          />
          <StatCard 
            title="Open Requests" 
            value={openRequests} 
            icon={<FileText size={24} />} 
          />
          <StatCard 
            title="Closed Requests" 
            value={closedRequests} 
            icon={<Check size={24} />} 
          />
        </div>

        {/* Announcements section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAnnouncements.length > 0 ? (
              sortedAnnouncements.slice(0, 4).map(announcement => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <p className="text-gray-500">No announcements available</p>
            )}
          </div>
        </div>

        {/* Recent Requests section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Requests</h2>
            <div className="mt-2 md:mt-0 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                className="pl-10 max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? "No requests match your search criteria" 
                    : "You haven't submitted any requests yet"}
                </p>
                {!searchQuery && (
                  <Link to="/new-request">
                    <Button>Submit Your First Request</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
