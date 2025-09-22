// src/utils/withAuth.tsx
import { PendingApprovalAlert } from "@/components/alert/PendingApprovalAlert";
import { PageLoader } from "@/components/ui/Spinner";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types/index.types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);
    
    if (isLoading) {
      return <PageLoader/>; // Or a loading spinner
    }

    if (!data?.data?.email) {
      return <Navigate to="/login" />;
    }

    // Check if user has pending status
    if (data.data.status === "pending") {
      return <PendingApprovalAlert />;
    }

    if (requiredRole && requiredRole !== data.data.role) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};