/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import {
  BoltIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserCheck,
  UserX,
  Clock,
  User,
  Shield
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { role } from "@/constant/role";
import { useRequestToBecomeAgentMutation, useCancelAgentRequestMutation } from "@/redux/features/agent/agent.api";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";

// Navigation links (role-based)
const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/tours", label: "Tours", role: "PUBLIC" },
  { href: "/admin", label: "Dashboard", role: role.admin },
  { href: "/agent", label: "Dashboard", role: role.agent },
  { href: "/user", label: "Dashboard", role: role.user },
];

interface UserProfileProps {
  data: {
    data?: {
      _id?: string;
      name?: string;
      email?: string;
      role?: string;
      status?: string;
      avatar?: string;
      agentRequest?: {
        status: string;
        requestedAt?: string;
        reviewedAt?: string;
        rejectionReason?: string;
      };
    };
  };
  refetch?: () => void;
}

export default function UserProfile({ data, refetch }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [requestToBecomeAgent, { isLoading: isRequesting }] = useRequestToBecomeAgentMutation();
  const [cancelAgentRequest, { isLoading: isCancelling }] = useCancelAgentRequestMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = data?.data;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBecomeAgent = async () => {
    try {
      await requestToBecomeAgent(undefined).unwrap();
      toast.success("Agent request submitted successfully!");
      refetch?.();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to submit agent request");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelAgentRequest(undefined).unwrap();
      toast.success("Agent request cancelled successfully!");
      refetch?.();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to cancel agent request");
    }
  };

  const getStatusBadge = () => {
    if (!user?.role) return null;

    const statusConfig = {
      agent: {
        pending: { variant: "secondary" as const, icon: Clock, text: "Pending Approval" },
        active: { variant: "success" as const, icon: UserCheck, text: "Approved Agent" },
        blocked: { variant: "destructive" as const, icon: UserX, text: "Suspended Agent" },
      },
      admin: { variant: "default" as const, icon: Shield, text: "Admin" },
      user: { variant: "outline" as const, icon: User, text: "User" },
    };

    const config = user.role === "agent" 
      ? statusConfig.agent[user.status as keyof typeof statusConfig.agent] 
      : statusConfig[user.role as keyof Omit<typeof statusConfig, 'agent'>];

    if (!config) return null;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 px-2 py-1">
        <config.icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const shouldShowAgentActions = () => {
    return user?.role === "user" && user?.status === "active";
  };

  const hasPendingAgentRequest = () => {
    return user?.status === "pending" && user?.role === "user";
  };

  const dashboardLink = navigationLinks.find(link => link.role === user?.role);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(authApi.util.resetApiState());
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.data?.message || "Logout failed");
      // Force logout even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
      window.location.reload();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-11 px-2 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
              isOpen && "bg-accent border-gray-200 dark:border-gray-600"
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                <AvatarImage 
                  src={user?.avatar || "/api/placeholder/32/32"} 
                  alt={user?.name} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || "Guest"}
                </span>
              </div>
              
              <ChevronDownIcon
                size={16}
                className={cn(
                  "text-gray-500 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          className="w-80 max-w-[90vw] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
          onInteractOutside={(event) => {
            // Prevent closing when clicking on the trigger
            if (dropdownRef.current?.contains(event.target as Node)) {
              event.preventDefault();
            }
          }}
        >
          {/* User Info Section */}
          <DropdownMenuLabel className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <div className="mt-1">
                  {getStatusBadge()}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Quick Actions */}
          <DropdownMenuGroup className="p-2">
            {dashboardLink && (
              <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                <Link to={dashboardLink.href} className="flex items-center gap-3 goDashboard">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BoltIcon size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Dashboard</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Access your workspace</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
              <Link to="/profile" className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <User size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Profile Settings</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Manage your account</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Agent Actions */}
          {(shouldShowAgentActions() || hasPendingAgentRequest()) && (
            <>
              <DropdownMenuGroup className="p-2">
                {shouldShowAgentActions() && (
                  <DropdownMenuItem
                    onClick={handleBecomeAgent}
                    disabled={isRequesting}
                    className="rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <UserCheck size={18} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="font-medium">Become an Agent</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {isRequesting ? "Submitting request..." : "Start earning commissions"}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}

                {hasPendingAgentRequest() && (
                  <DropdownMenuItem
                    onClick={handleCancelRequest}
                    disabled={isCancelling}
                    className="rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <UserX size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium">Cancel Request</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {isCancelling ? "Cancelling..." : "Withdraw agent application"}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Footer Actions */}
          <DropdownMenuGroup className="p-2">
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg p-3 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <LogOutIcon size={18} />
                </div>
                <div>
                  <div className="font-medium">
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</div>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}