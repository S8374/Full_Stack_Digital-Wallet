import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router";
import { PendingApprovalAlert } from "../alert/PendingApprovalAlert";

// Update Dashboard.tsx
export default function Dashboard() {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  const user = userData?.data;

  // Show pending approval alert if user status is pending
  if (user?.status === "pending") {
    return <PendingApprovalAlert />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <header className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
            >
              {/* Hamburger icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Digital Wallet Dashboard
            </h1>
          </div>

        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}