/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/User/sendMoney/SendMoney.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, CheckCircle2, XCircle, Send, Loader2, DollarSign } from 'lucide-react';
import { useGetMyWalletQuery, useSendMoneyMutation } from '@/redux/features/wallet/wallet.api';
import { useSearchUsersQuery, useCreateMoneyRequestMutation, useGetMyRequestsQuery } from '@/redux/features/moneyRequest/moneyRequest.api';
import MoneyRequestManager from './MoneyRequestManager';
// import MoneyRequestManager from '@/components/MoneyRequestManager';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export default function SendMoney() {
  const [activeTab, setActiveTab] = useState('send');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Use the correct hooks from APIs
  const { data: searchResults, isLoading: isSearching, error: searchError } = useSearchUsersQuery(searchQuery, {
    skip: searchQuery.length < 3
  });

  const { data: walletData, refetch: refetchWallet } = useGetMyWalletQuery(undefined);
  const [sendMoney, { isLoading: isSending }] = useSendMoneyMutation();
  const [createMoneyRequest, { isLoading: isCreatingRequest }] = useCreateMoneyRequestMutation();
  const { data: myReq } = useGetMyRequestsQuery('sent');
  console.log(myReq)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSelectedUser(null);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchError) {
      setErrorMessage('Failed to search users');
    }
  }, [searchError]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setErrorMessage('');
  };

  const handleUserSelect = (user: User) => {
    console.log(user)
    setSelectedUser(user);
    setSearchQuery(user.name || user.email);
  };

  const handleSendMoney = async () => {
    if (!selectedUser || !amount) return;
    console.log("Selected user and amount", selectedUser, amount)
    try {
      const result = await sendMoney({
        toUserId: selectedUser._id,
        amount: parseFloat(amount),
        description
      }).unwrap();
      console.log(result)
      setSuccessMessage('Money sent successfully!');
      setConfirmationOpen(false);
      setSelectedUser(null);
      setSearchQuery('');
      setAmount('');
      setDescription('');

      // Refetch wallet data to update balance
      refetchWallet();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Send money error:', error);
      setErrorMessage(error.data?.message || 'Failed to send money');
      setConfirmationOpen(false);
    }
  };

  const handleRequestMoney = async () => {
    if (!selectedUser || !amount) return;
    console.log(selectedUser)
    try {
      const result = await createMoneyRequest({
        toUserId: selectedUser._id,
        amount: parseFloat(amount),
        description
      }).unwrap();
      console.log(result)
      setSuccessMessage('Money request sent successfully!');
      setConfirmationOpen(false);
      setSelectedUser(null);
      setSearchQuery('');
      setAmount('');
      setDescription('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Request money error:', error);
      setErrorMessage(error.data?.message || 'Failed to send money request');
      setConfirmationOpen(false);
    }
  };

  const handleOpenConfirmation = () => {
    if (selectedUser && amount && parseFloat(amount) > 0) {
      if (activeTab === 'send') {
        // Check if user has sufficient balance for sending money
        if (walletData?.data?.balance && parseFloat(amount) > walletData.data.balance) {
          setErrorMessage('Insufficient balance');
          return;
        }
      }
      setConfirmationOpen(true);
    }
  };

  const handleConfirmAction = () => {
    if (activeTab === 'send') {
      handleSendMoney();
    } else {
      handleRequestMoney();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const getActionButtonText = () => {
    if (activeTab === 'send') {
      return isSending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Money
        </>
      );
    } else {
      return isCreatingRequest ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending Request...
        </>
      ) : (
        <>
          <DollarSign className="mr-2 h-4 w-4" />
          Request Money
        </>
      );
    }
  };

  const getDialogTitle = () => {
    return activeTab === 'send'
      ? 'Confirm Money Transfer'
      : 'Confirm Money Request';
  };

  const getDialogDescription = () => {
    return activeTab === 'send'
      ? 'Please review the details before confirming your transaction'
      : 'Please review the details before sending your money request';
  };

  const getConfirmationButtonText = () => {
    return activeTab === 'send'
      ? isSending ? 'Processing...' : 'Confirm Transfer'
      : isCreatingRequest ? 'Sending Request...' : 'Confirm Request';
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Money</TabsTrigger>
          <TabsTrigger value="request">My sended Req for Money</TabsTrigger>
          <TabsTrigger value="requests">Manage Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>
                Transfer money to other users quickly and securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Available Balance:</span>
                <span className="font-semibold">
                  {walletData?.data?.balance ? formatCurrency(walletData.data.balance) : 'Loading...'}
                </span>
              </div>

              <SendMoneyForm
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchResults={searchResults?.data}
                isSearching={isSearching}
                selectedUser={selectedUser}
                onUserSelect={handleUserSelect}
                onUserRemove={() => {
                  setSelectedUser(null);
                  setSearchQuery('');
                }}
                amount={amount}
                onAmountChange={setAmount}
                description={description}
                onDescriptionChange={setDescription}
                onAction={handleOpenConfirmation}
                isActionLoading={isSending}
                actionButtonText={getActionButtonText()}
                disabled={!selectedUser || !amount || parseFloat(amount) <= 0}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="request" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Money Requests</CardTitle>
              <CardDescription>
                Track all the money requests you’ve sent, their status, and details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!myReq?.data?.length ? (
                <div className="text-center py-10 text-muted-foreground">
                  <User className="mx-auto h-10 w-10 mb-3 opacity-50" />
                  <p>No money requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReq.data.map((req: any) => (
                    <Card key={req._id} className="border shadow-sm hover:shadow-md transition rounded-xl">
                      <CardContent className="p-4 space-y-3">
                        {/* Top section */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-base">{req.toUser?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{req.toUser?.email || req.toUser}</p>
                          </div>
                          <Badge
                            className={
                              req.status === "approved"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : req.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Middle info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium text-primary">৳{req.amount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Description</p>
                            <p className="font-medium">{req.description || "—"}</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <p>Created: {new Date(req.createdAt).toLocaleString()}</p>
                          <p>Updated: {new Date(req.updatedAt).toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="requests" className="space-y-6 mt-4">
          <MoneyRequestManager />
        </TabsContent>
      </Tabs>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name || selectedUser?.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.phone || selectedUser?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{amount ? formatCurrency(parseFloat(amount)) : '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{description || '—'}</p>
              </div>
            </div>

            {activeTab === 'send' && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="font-medium">{walletData?.data?.balance ? formatCurrency(walletData.data.balance) : 'Loading...'}</p>
                <p className="text-sm text-muted-foreground mt-2">Balance After Transfer</p>
                <p className="font-medium">
                  {walletData?.data?.balance && amount
                    ? formatCurrency(walletData.data.balance - parseFloat(amount))
                    : '—'
                  }
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={activeTab === 'send' ? isSending : isCreatingRequest}
            >
              {getConfirmationButtonText()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate form component to avoid code duplication
interface SendMoneyFormProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults: any[];
  isSearching: boolean;
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onUserRemove: () => void;
  amount: string;
  onAmountChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onAction: () => void;
  isActionLoading: boolean;
  actionButtonText: React.ReactNode;
  disabled: boolean;
  placeholder?: string;
}

function SendMoneyForm({
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  selectedUser,
  onUserSelect,
  onUserRemove,
  amount,
  onAmountChange,
  description,
  onDescriptionChange,
  onAction,
  isActionLoading,
  actionButtonText,
  disabled,
  placeholder = "e.g., Lunch money, Rent, etc."
}: SendMoneyFormProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">Recipient</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search for user by name, email or phone"
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {isSearching && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {searchResults && searchQuery.length >= 3 && !selectedUser && (
        <ScrollArea className="h-60 rounded-md border">
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium leading-none">Search Results</h4>
            {searchResults.map((user: User) => (
              <div
                key={user._id}
                className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <Avatar>
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.phone || user.email}</p>
                </div>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <User className="mx-auto h-8 w-8 mb-2" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {selectedUser && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name || selectedUser.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone || selectedUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onUserRemove}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">Amount (BDT)</label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          min="1"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
        <Input
          id="description"
          placeholder={placeholder}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        onClick={onAction}
        disabled={disabled || isActionLoading}
        size="lg"
      >
        {actionButtonText}
      </Button>
    </>
  );
}