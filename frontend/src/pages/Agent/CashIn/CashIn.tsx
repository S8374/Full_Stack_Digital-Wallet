/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Agent/CashManagement.tsx
import { useState, useEffect } from "react";
import { 
  Plus, 
  Minus,
  Search, 
  User, 
  Wallet, 
  CheckCircle,

  Loader2,

  TrendingUp,
  TrendingDown,

  Filter,
  MoreVertical
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
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
import { 
  useCashInMutation, 
  useCashOutMutation, 
  useGetAllUserQuery 
} from "@/redux/features/agent/agent.api";
import { useGetMyWalletQuery } from "@/redux/features/wallet/wallet.api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  wallet?: {
    balance: number;
    currency: string;
    status: string;
    _id: string;
  };
  status: string;
  isVerified: boolean;
  createdAt: string;
  transactions: any[];
}

export default function CashManagement() {
  const [selectedAction, setSelectedAction] = useState<"cashIn" | "cashOut" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  const [cashIn, { isLoading: isCashInLoading }] = useCashInMutation();
  const [cashOut, { isLoading: isCashOutLoading }] = useCashOutMutation();
  const { data: agentWallet } = useGetMyWalletQuery(undefined);
  const { data: allUserData, isLoading: isUsersLoading } = useGetAllUserQuery(undefined);
 // const { data: myTransaction } = useGetMyTransactionQuery(undefined);
  
  const users = allUserData?.data?.users || [];

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((user: User) => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.includes(query))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleAction = (user: User, action: "cashIn" | "cashOut") => {
    setSelectedUser(user);
    setSelectedAction(action);
    setAmount("");
  };

  const handleConfirm = async () => {
    if (!selectedUser || !selectedAction || !amount) return;

    try {
      const payload = {
        userId: selectedUser._id,
        amount: parseFloat(amount)
      };

      const result = selectedAction === "cashIn" 
        ? await cashIn(payload).unwrap()
        : await cashOut(payload).unwrap();

      if (result.success) {
        setIsConfirmationOpen(false);
        setSelectedUser(null);
        setSelectedAction(null);
        setAmount("");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Cash Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Manage user wallets and perform cash transactions
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wallet className="w-4 h-4" />
          <span>Agent Balance: {formatCurrency(agentWallet?.data?.balance || 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User List */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage cash operations for all system users
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  {isUsersLoading ? (
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
                    filteredUsers.map((user) => (
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
                          {getStatusBadge(user.status)}
                          {user.isVerified && (
                            <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">Verified</Badge>
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
                              <DropdownMenuItem 
                                onClick={() => handleAction(user, 'cashIn')}
                                className="flex items-center gap-2"
                              >
                                <Plus className="h-4 w-4 text-green-600" />
                                <span>Cash In</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAction(user, 'cashOut')}
                                className="flex items-center gap-2"
                              >
                                <Minus className="h-4 w-4 text-red-600" />
                                <span>Cash Out</span>
                              </DropdownMenuItem>
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
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Today's Cash-In</p>
                  <p className="text-2xl font-bold text-blue-600">৳1,250</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Today's Cash-Out</p>
                  <p className="text-2xl font-bold text-red-600">৳2,150</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-xl font-bold">{users.length}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xl font-bold text-green-600">
                    {users.filter((u: User) => u.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">Quick Guide</h4>
                  <ul className="text-sm text-orange-600 dark:text-orange-300 mt-2 space-y-1">
                    <li>• Click action menu for each user</li>
                    <li>• Select Cash In or Cash Out</li>
                    <li>• Enter the amount to process</li>
                    <li>• Confirm the transaction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'cashIn' ? 'Cash In' : 'Cash Out'}
            </DialogTitle>
            <DialogDescription>
              {selectedAction === 'cashIn' 
                ? 'Add money to user wallet' 
                : 'Withdraw money from user wallet'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    {selectedUser.wallet && (
                      <p className="text-sm font-medium">
                        Balance: {formatCurrency(selectedUser.wallet.balance)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (BDT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    className="text-lg font-semibold"
                  />
                  {selectedAction === 'cashOut' && selectedUser.wallet && 
                   parseFloat(amount) > selectedUser.wallet.balance && (
                    <p className="text-sm text-red-600">
                      User doesn't have sufficient balance
                    </p>
                  )}
                </div>

                {amount && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Balance:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedUser.wallet?.balance || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transaction Amount:</span>
                      <span className={selectedAction === 'cashIn' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {selectedAction === 'cashIn' ? '+' : '-'}{formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">New Balance:</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          selectedAction === 'cashIn' 
                            ? (selectedUser.wallet?.balance || 0) + parseFloat(amount)
                            : (selectedUser.wallet?.balance || 0) - parseFloat(amount)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAction(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsConfirmationOpen(true)}
                  disabled={!amount || parseFloat(amount) <= 0 || 
                    (selectedAction === 'cashOut' && selectedUser.wallet && 
                     parseFloat(amount) > selectedUser.wallet.balance)}
                  className={
                    selectedAction === 'cashIn' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {selectedAction === 'cashIn' ? (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Cash In
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 mr-2" />
                      Cash Out
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Confirm {selectedAction === 'cashIn' ? 'Cash In' : 'Cash Out'}
            </DialogTitle>
            <DialogDescription>
              Please review the transaction details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User:</span>
                  <span className="font-medium">{selectedUser.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Action:</span>
                  <Badge variant={selectedAction === 'cashIn' ? 'default' : 'destructive'}>
                    {selectedAction === 'cashIn' ? 'Cash In' : 'Cash Out'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className={
                    selectedAction === 'cashIn' 
                      ? 'font-semibold text-green-600' 
                      : 'font-semibold text-red-600'
                  }>
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current User Balance:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedUser.wallet?.balance || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New User Balance:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      selectedAction === 'cashIn' 
                        ? (selectedUser.wallet?.balance || 0) + parseFloat(amount)
                        : (selectedUser.wallet?.balance || 0) - parseFloat(amount)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Agent Balance:</span>
                  <span className="font-medium">{formatCurrency(agentWallet?.data?.balance || 0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Agent Balance:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      selectedAction === 'cashIn' 
                        ? (agentWallet?.data?.balance || 0) - parseFloat(amount)
                        : (agentWallet?.data?.balance || 0) + parseFloat(amount)
                    )}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  disabled={isCashInLoading || isCashOutLoading}
                  className={
                    selectedAction === 'cashIn' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {(isCashInLoading || isCashOutLoading) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Confirm ${selectedAction === 'cashIn' ? 'Cash In' : 'Cash Out'}`
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}