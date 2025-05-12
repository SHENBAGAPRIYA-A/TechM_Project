
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { requestsAPI, announcementsAPI, reportsAPI } from "@/services/api";
import { Announcement, HelpdeskRequest, Report } from "@/types/helpdesk";
import StatCard from "@/components/dashboard/StatCard";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import { 
  BarChart as BarChartIcon, 
  FileText, 
  Loader2, 
  MessageSquare, 
  Plus, 
  UserCheck 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

const AdminDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [requests, setRequests] = useState<HelpdeskRequest[]>([]);
  const [reportData, setReportData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  
  const COLORS = ['#0284c7', '#4ade80', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch data in parallel
        const [announcementsData, requestsData, reportData] = await Promise.all([
          announcementsAPI.getAnnouncements(),
          requestsAPI.getRequests(),
          reportsAPI.getReports(),
        ]);
        
        setAnnouncements(announcementsData);
        setRequests(requestsData);
        setReportData(reportData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sort announcements to show important ones first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get recent requests
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <Layout requireAuth requireAdmin>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of helpdesk requests and system performance</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/admin/announcements">
              <Button className="helpdesk-gradient">
                <Plus className="mr-2 h-4 w-4" /> 
                New Announcement
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {reportData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Requests" 
              value={reportData.totalRequests} 
              icon={<FileText size={24} />} 
            />
            <StatCard 
              title="Open Requests" 
              value={reportData.openRequests} 
              icon={<FileText size={24} />} 
            />
            <StatCard 
              title="Closed Requests" 
              value={reportData.closedRequests} 
              icon={<UserCheck size={24} />} 
            />
            <StatCard 
              title="Avg. Resolution Time" 
              value={`${reportData.averageResolutionTimeInHours.toFixed(1)} hrs`}
              icon={<BarChartIcon size={24} />} 
            />
          </div>
        )}

        {/* Charts */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requests by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.requestsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="label"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.requestsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requests by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.requestsByMonth}>
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Requests" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Announcements */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Announcements</h2>
            <Link to="/admin/announcements" className="text-sm text-helpdesk-600 hover:text-helpdesk-800">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAnnouncements.slice(0, 2).map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
            {announcements.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No announcements have been created yet</p>
                <Link to="/admin/announcements" className="mt-2 inline-block">
                  <Button size="sm">Create First Announcement</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
            <Link to="/admin/requests" className="text-sm text-helpdesk-600 hover:text-helpdesk-800">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentRequests.map(request => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{request.description.substring(0, 100)}{request.description.length > 100 ? '...' : ''}</p>
                    <p className="text-sm text-gray-600 mt-1">From: {request.studentName}</p>
                  </div>
                  <Link to={`/admin/requests/${request.id}`} className="text-sm text-helpdesk-600 hover:text-helpdesk-800">
                    View →
                  </Link>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No requests have been submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
