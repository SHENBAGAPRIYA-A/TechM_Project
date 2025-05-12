
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-helpdesk-800 mb-6">Student Helpdesk Application</h1>
            <p className="text-xl text-gray-600">
              A centralized platform for students to submit and track helpdesk requests
            </p>
          </div>

          <div className="mt-10">
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Welcome back, <span className="font-semibold">{user?.name}</span>
                </p>
                <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button className="helpdesk-gradient text-lg py-6 px-8">
                    Go to {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button className="helpdesk-gradient text-lg py-6 px-8">
                  Login to Get Started
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="helpdesk-card">
              <div className="rounded-full bg-helpdesk-100 w-12 h-12 flex items-center justify-center text-helpdesk-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Submit Requests</h3>
              <p className="text-gray-600">
                Easily submit maintenance, IT issues, ID card requests, and more.
              </p>
            </div>

            <div className="helpdesk-card">
              <div className="rounded-full bg-helpdesk-100 w-12 h-12 flex items-center justify-center text-helpdesk-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Track Status</h3>
              <p className="text-gray-600">
                Stay updated on the progress of your requests with real-time status tracking.
              </p>
            </div>

            <div className="helpdesk-card">
              <div className="rounded-full bg-helpdesk-100 w-12 h-12 flex items-center justify-center text-helpdesk-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Announcements</h3>
              <p className="text-gray-600">
                Receive important college announcements and updates directly on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
