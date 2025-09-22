// src/pages/Admin/UserManagement.tsx
import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Eye,
  Ban,
  CheckCircle,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetUserByIdQuery
} from "@/redux/features/admin/admin.api";
import { UserStatus } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/utils/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  role: string;
  isVerified: boolean;
  createdAt: string;
  wallet?: {
    balance: number;
    currency: string;
    status: string;
  };
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"block" | "unblock">("block");

  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const { data: userDetail, isLoading: isDetailLoading } = useGetUserByIdQuery(
    selectedUser?._id || "",
    { skip: !selectedUser?._id }
  );

  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination;

  const handleStatusUpdate = async () => {
    if (!selectedUser) return;

    try {
      await updateUserStatus({
        userId: selectedUser._id,
        status: statusAction === "block" ? UserStatus.BLOCKED : UserStatus.ACTIVE
      }).unwrap();

      setIsStatusDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const openStatusDialog = (user: User, action: "block" | "unblock") => {
    setSelectedUser(user);
    setStatusAction(action);
    setIsStatusDialogOpen(true);
  };

  const getStatusVariant = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "success";
      case UserStatus.BLOCKED:
        return "destructive";
      case UserStatus.PENDING:
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all system users</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {pagination?.total || 0} users found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                          {user.phone && (
                            <span className="text-sm text-muted-foreground">{user.phone}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status)}>
                        {user.status}
                      </Badge>
                      {user.isVerified && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {user.wallet ? formatCurrency(user.wallet.balance) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openUserDetail(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {user.status === UserStatus.ACTIVE ? (
                            <DropdownMenuItem onClick={() => openStatusDialog(user, 'block')}>
                              <Ban className="h-4 w-4 mr-2 text-red-600" />
                              Block User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openStatusDialog(user, 'unblock')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Unblock User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                  <p className="text-muted-foreground">{selectedUser?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="text-sm">
                    <p><strong>Phone:</strong> {selectedUser?.phone || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                      <Badge variant={getStatusVariant(selectedUser?.status as UserStatus)} className="ml-2">
                        {selectedUser?.status}
                      </Badge>
                    </p>
                    <p><strong>Role:</strong> {selectedUser?.role}</p>
                    <p><strong>Verified:</strong> {selectedUser?.isVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Joined:</strong> {formatDate(selectedUser?.createdAt || '')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Wallet Information</h4>
                  {userDetail?.data?.wallet ? (
                    <div className="text-sm">
                      <p><strong>Balance:</strong> {formatCurrency(userDetail.data.wallet.balance)}</p>
                      <p><strong>Currency:</strong> {userDetail.data.wallet.currency}</p>
                      <p><strong>Status:</strong> 
                        <Badge variant={userDetail.data.wallet.status === 'active' ? 'success' : 'destructive'} className="ml-2">
                          {userDetail.data.wallet.status}
                        </Badge>
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No wallet information available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'block' ? 'Block User' : 'Unblock User'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusAction} {selectedUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              variant={statusAction === 'block' ? 'destructive' : 'default'}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `${statusAction === 'block' ? 'Block' : 'Unblock'} User`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}