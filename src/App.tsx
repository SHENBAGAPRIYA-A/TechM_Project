
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentRequestList from "./pages/student/RequestList";
import RequestDetail from "./pages/student/RequestDetail";
import NewRequestPage from "./pages/student/NewRequest";
import ProfilePage from "./pages/student/ProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminRequestDetail from "./pages/admin/AdminRequestDetail";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminReports from "./pages/admin/AdminReports";
import StudentManagement from "./pages/admin/StudentManagement";
import AdminRoles from "./pages/admin/AdminRoles";
import SystemSettings from "./pages/admin/SystemSettings";

// Auth Pages
import LoginPage from "./pages/LoginPage";

// Other Pages
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/requests" element={<StudentRequestList />} />
            <Route path="/requests/:requestId" element={<RequestDetail />} />
            <Route path="/new-request" element={<NewRequestPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/requests/:requestId" element={<AdminRequestDetail />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/settings" element={<SystemSettings />} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
