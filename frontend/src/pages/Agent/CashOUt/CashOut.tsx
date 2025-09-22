/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Agent/CashOut.tsx
import { useState, useEffect } from "react";
import { 
  Minus, 
  Search, 
  User, 
  Wallet, 
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3,
  TrendingDown,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useCashOutMutation, useLazySearchUsersQuery, useGetAllUserQuery } from "@/redux/features/agent/agent.api";
import { useGetMyWalletQuery } from "@/redux/features/wallet/wallet.api";
import { useGetMyTransactionQuery } from "@/redux/features/payment/payment.api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  wallet?: {
    balance: number;
    currency: string;
  };
}

export default function CashOut() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [_isSearching, setIsSearching] = useState(false);
  
  const [searchUsers, { isLoading: isSearchLoading }] = useLazySearchUsersQuery();
  const [cashOut, { isLoading: isCashOutLoading }] = useCashOutMutation();
  const { data: agentWallet } = useGetMyWalletQuery(undefined);
const {data:myTransaction}=useGetMyTransactionQuery(undefined);
const {data : allUser}=useGetAllUserQuery(undefined);
console.log("all user",allUser , myTransaction);
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const result = await searchUsers(searchQuery).unwrap();
          setSearchResults(result.data || []);
        } catch (error) {
            console.log(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchUsers]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCashOut = async () => {
    if (!selectedUser || !amount) return;

    try {
      const result = await cashOut({
        userId: selectedUser._id,
        amount: parseFloat(amount)
      }).unwrap();

      if (result.success) {
        setIsConfirmationOpen(false);
        setSelectedUser(null);
        setAmount("");
        
      }
    } catch (error: any) {
        console.log(error)
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };


  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Cash Out Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Withdraw money from user wallets
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wallet className="w-4 h-4" />
          <span>Agent Balance: {formatCurrency(agentWallet?.data?.balance || 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Out from User Wallet</CardTitle>
              <CardDescription>
                Search for a user and withdraw money from their wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Search */}
              <div className="space-y-2">
                <Label htmlFor="user-search">Search User</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-search"
                    placeholder="Search by name, email, or phone..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg mt-2 max-h-60 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.phone && (
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                            )}
                          </div>
                          {user.wallet && (
                            <Badge variant="outline" className="ml-2">
                              {formatCurrency(user.wallet.balance)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearchLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Searching...</span>
                  </div>
                )}
              </div>

              {/* Selected User */}
              {selectedUser && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(null)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              {selectedUser && (
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
                  {selectedUser.wallet && parseFloat(amount) > selectedUser.wallet.balance && (
                    <p className="text-sm text-red-600">
                      User doesn't have sufficient balance
                    </p>
                  )}
                </div>
              )}

              {/* Action Button */}
              {selectedUser && amount && (
                <Button
                  onClick={() => setIsConfirmationOpen(true)}
                  disabled={!amount || parseFloat(amount) <= 0 || 
                    (selectedUser.wallet && parseFloat(amount) > selectedUser.wallet.balance)}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Cash Out ৳{amount}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Cash-Out Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Today's Cash-Out</p>
                  <p className="text-2xl font-bold text-red-600">৳2,150</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-orange-600">৳18,420</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium">Transactions</p>
                  <p className="text-xl font-bold">32</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-xl font-bold text-green-600">96%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Security Checklist</h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 mt-2 space-y-1">
                    <li>• Verify user identity with photo ID</li>
                    <li>• Confirm transaction amount twice</li>
                    <li>• Get user signature confirmation</li>
                    <li>• Keep all transaction records</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Cash-Out</DialogTitle>
            <DialogDescription>
              Please review the transaction details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">User:</span>
              <span className="font-medium">{selectedUser?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-semibold text-red-600">{formatCurrency(parseFloat(amount))}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">User Balance:</span>
              <span className="font-medium">
                {formatCurrency(selectedUser?.wallet?.balance || 0)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New User Balance:</span>
              <span className="font-semibold">
                {formatCurrency((selectedUser?.wallet?.balance || 0) - parseFloat(amount))}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Agent Balance:</span>
              <span className="font-medium">{formatCurrency(agentWallet?.data?.balance || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New Agent Balance:</span>
              <span className="font-semibold">
                {formatCurrency((agentWallet?.data?.balance || 0) + parseFloat(amount))}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCashOut} 
              disabled={isCashOutLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCashOutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Cash-Out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}