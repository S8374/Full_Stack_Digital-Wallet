// src/pages/Admin/WalletManagement.tsx
import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Wallet,
  Eye,
  Lock,
  Unlock,
  Loader2,
  AlertCircle
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
  useGetAllWalletsQuery,
  useUpdateWalletStatusMutation
} from "@/redux/features/admin/admin.api";
import { formatCurrency, formatDate } from "@/utils/utils";
import { WalletStatus } from "@/types/user.types";

interface Wallet {
  _id: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  type: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  } | null; // Allow userId to be null
}

export default function WalletManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"block" | "unblock">("block");

  const { data: walletsData, isLoading, refetch } = useGetAllWalletsQuery(undefined);
  const [updateWalletStatus, { isLoading: isUpdating }] = useUpdateWalletStatusMutation();

  const wallets = walletsData?.data || [];

  const handleStatusUpdate = async () => {
    if (!selectedWallet) return;

    try {
      await updateWalletStatus({
        walletId: selectedWallet._id,
        status: statusAction === "block" ? WalletStatus.BLOCKED : WalletStatus.ACTIVE
      }).unwrap();

      setIsStatusDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update wallet status:", error);
    }
  };

  const openStatusDialog = (wallet: Wallet, action: "block" | "unblock") => {
    setSelectedWallet(wallet);
    setStatusAction(action);
    setIsStatusDialogOpen(true);
  };

  const getStatusVariant = (status: WalletStatus) => {
    switch (status) {
      case WalletStatus.ACTIVE:
        return "success";
      case WalletStatus.BLOCKED:
        return "destructive";
      case WalletStatus.SUSPENDED:
        return "secondary";
      default:
        return "outline";
    }
  };

  // Safe filtering that handles null userId
  const filteredWallets = wallets.filter((wallet: Wallet) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check if userId exists before accessing its properties
    const userName = wallet.userId?.name?.toLowerCase() || '';
    const userEmail = wallet.userId?.email?.toLowerCase() || '';
    
    return (
      userName.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      wallet._id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
          <p className="text-muted-foreground">Manage and monitor all user wallets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Wallets</p>
                <p className="text-2xl font-bold">{wallets.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Wallets</p>
                <p className="text-2xl font-bold">
                  {wallets.filter((w: { status: WalletStatus; }) => w.status === WalletStatus.ACTIVE).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Unlock className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Blocked Wallets</p>
                <p className="text-2xl font-bold">
                  {wallets.filter((w: { status: WalletStatus; }) => w.status === WalletStatus.BLOCKED).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Wallets</CardTitle>
            <CardDescription>
              {filteredWallets.length} wallets found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wallets..."
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
                <TableHead>Wallet ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading wallets...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredWallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No wallets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWallets.map((wallet: Wallet) => (
                  <TableRow key={wallet._id}>
                    <TableCell className="font-mono text-sm">
                      {wallet._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          {wallet.userId ? (
                            <>
                              <span className="font-medium">{wallet.userId.name}</span>
                              <span className="text-sm text-muted-foreground">{wallet.userId.email}</span>
                              <Badge variant={wallet.userId.status === 'active' ? 'success' : 'destructive'} className="mt-1 w-fit">
                                {wallet.userId.role}
                              </Badge>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-sm">User not found</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(wallet.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{wallet.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(wallet.status)}>
                        {wallet.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(wallet.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {wallet.status === WalletStatus.ACTIVE ? (
                            <DropdownMenuItem onClick={() => openStatusDialog(wallet, 'block')}>
                              <Lock className="h-4 w-4 mr-2 text-red-600" />
                              Block Wallet
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => openStatusDialog(wallet, 'unblock')}>
                              <Unlock className="h-4 w-4 mr-2 text-green-600" />
                              Unblock Wallet
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

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'block' ? 'Block Wallet' : 'Unblock Wallet'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusAction} the wallet of {selectedWallet?.userId?.name || 'Unknown User'}?
              {statusAction === 'block' && ' This will prevent any transactions from this wallet.'}
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
                `${statusAction === 'block' ? 'Block' : 'Unblock'} Wallet`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}