
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { reportsAPI } from "@/services/api";
import { Report } from "@/types/helpdesk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { FileText, Settings, UserCheck } from "lucide-react";

const COLORS = ['#0284c7', '#4ade80', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];

const AdminReports = () => {
  const [reportData, setReportData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const data = await reportsAPI.getReports();
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <Layout requireAuth requireAdmin>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  if (!reportData) {
    return (
      <Layout requireAuth requireAdmin>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Data Not Available</h2>
          <p className="text-gray-600">
            There was a problem loading the report data. Please try again later.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Helpdesk Reports</h1>
          <p className="text-gray-600">View statistics and data about helpdesk requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            icon={<Settings size={24} />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Request Types */}
          <Card>
            <CardHeader>
              <CardTitle>Requests by Type</CardTitle>
              <CardDescription>
                Distribution of helpdesk requests by category
              </CardDescription>
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

          {/* Request Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Requests by Priority</CardTitle>
              <CardDescription>
                Distribution of helpdesk requests by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.requestsByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Requests"
                      fill="#0ea5e9"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Requests Trend</CardTitle>
              <CardDescription>
                Monthly trend of helpdesk requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.requestsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Requests"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminReports;
