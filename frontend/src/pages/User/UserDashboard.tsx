/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/User/UserDashboard.tsx
import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Download,
  Send,
  Users,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Search,
  MoreHorizontal,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useGetCancelPaymentQuery, useGetCompletePaymentQuery, useGetMyTransactionQuery, useRetryPaymentMutation } from "@/redux/features/payment/payment.api";
import { useGetMyWalletQuery } from "@/redux/features/wallet/wallet.api";

// Define types based on your enums
enum PAYMENT_TYPE {
  ADD_MONEY = "ADD_MONEY",
  SEND_MONEY = "SEND_MONEY",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  WITHDRAW = "WITHDRAW"
}

enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isRetryDialogOpen, setIsRetryDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // API calls
  const { data: cancelledPayments, refetch: refetchCancelled } = useGetCancelPaymentQuery(undefined);
  const { data: transactions, refetch: refetchTransactions } = useGetMyTransactionQuery(undefined);
  const { data: completedPayments, refetch: refetchCompleted } = useGetCompletePaymentQuery(undefined);
  const [retryPayment, { isLoading: isRetryLoading }] = useRetryPaymentMutation();
  const { data: walletData } = useGetMyWalletQuery(undefined);
  const wallet = walletData?.data;
  console.log(wallet)
  // Filter functions
  const filterPayments = (payments: any[]) => {
    return payments.filter(payment => {
      // Status filter
      const statusMatch = statusFilter === "all" || payment.status === statusFilter;

      // Type filter
      const typeMatch = typeFilter === "all" || payment.type === typeFilter;

      // Search filter
      const searchMatch = searchQuery === "" ||
        payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && typeMatch && searchMatch;
    });
  };

  // Apply filters to data
  const filteredCancelledPayments = cancelledPayments?.data ? filterPayments(cancelledPayments.data) : [];
  const filteredTransactions = transactions?.data ? filterPayments(transactions.data) : [];
  const filteredCompletedPayments = completedPayments?.data ? filterPayments(completedPayments.data) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case "FAILED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "REFUNDED":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case PAYMENT_TYPE.ADD_MONEY:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Add Money</Badge>;
      case PAYMENT_TYPE.SEND_MONEY:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Send Money</Badge>;
      case PAYMENT_TYPE.CASH_IN:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Cash In</Badge>;
      case PAYMENT_TYPE.CASH_OUT:
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Cash Out</Badge>;
      case PAYMENT_TYPE.WITHDRAW:
        return <Badge variant="outline" className="bg-red-50 text-red-700">Withdraw</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleRetryPayment = async (payment: any) => {
    setSelectedPayment(payment);
    setIsRetryDialogOpen(true);
  };

  const confirmRetryPayment = async () => {
    if (!selectedPayment) return;

    try {
      const result = await retryPayment(selectedPayment._id).unwrap();

      if (result.success && result.data.paymentUrl) {
        setPaymentData(result.data);
        setIsPaymentModalOpen(true);
        setIsRetryDialogOpen(false);


        // Redirect to payment URL
        window.location.href = result.data.paymentUrl;
      }
    } catch (error: any) {
      console.error("Payment retry failed:", error);

    }
  };

  const handleExportData = () => {
    console.log("Exporting data");
    // Implement export logic here

  };

  const refetchAllData = () => {
    refetchCancelled();
    refetchTransactions();
    refetchCompleted();
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Payment Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Manage your finances and track your transactions
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportData}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={refetchAllData}>
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Button variant="outline" className="h-auto py-3 md:py-4 flex flex-col gap-1 md:gap-2 text-xs md:text-sm">
          <Send className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          <span>Send Money</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 md:py-4 flex flex-col gap-1 md:gap-2 text-xs md:text-sm">
          <Users className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          <span>Request</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 md:py-4 flex flex-col gap-1 md:gap-2 text-xs md:text-sm">
          <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
          <span>Add Money</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 md:py-4 flex flex-col gap-1 md:gap-2 text-xs md:text-sm">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
          <span>Withdraw</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{formatCurrency(wallet?.dailySpent || wallet?.balance)}
            </div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">{transactions?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600">{completedPayments?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-red-600">{cancelledPayments?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Cancelled payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter transactions by status, type, or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.PAID}>Paid/Completed</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.CANCELLED}>Cancelled</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.FAILED}>Failed</SelectItem>
                  <SelectItem value={PAYMENT_STATUS.REFUNDED}>Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={PAYMENT_TYPE.ADD_MONEY}>Add Money</SelectItem>
                  <SelectItem value={PAYMENT_TYPE.SEND_MONEY}>Send Money</SelectItem>
                  <SelectItem value={PAYMENT_TYPE.CASH_IN}>Cash In</SelectItem>
                  <SelectItem value={PAYMENT_TYPE.CASH_OUT}>Cash Out</SelectItem>
                  <SelectItem value={PAYMENT_TYPE.WITHDRAW}>Withdraw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Cancel Payment</TabsTrigger>
          <TabsTrigger value="transactions">Transactions History</TabsTrigger>
          <TabsTrigger value="completed">Complete Payment</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Cancelled Payments */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cancelled Payments</CardTitle>
                <CardDescription>
                  {filteredCancelledPayments.length} cancelled payments found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearchQuery("");
              }}>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </Button>
            </CardHeader>
            <CardContent>
              {filteredCancelledPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No cancelled payments found</p>
                  {(statusFilter !== "all" || typeFilter !== "all" || searchQuery !== "") && (
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setSearchQuery("");
                    }}>
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Amount</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredCancelledPayments.map((payment: any) => (
                          <tr key={payment._id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                  <XCircle className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{payment.description || `Payment #${payment.transactionId}`}</p>
                                  <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {getTypeBadge(payment.type)}
                            </td>
                            <td className="py-3 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-red-600">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleRetryPayment(payment)}>
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Retry
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Export</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab - All Transactions */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  {filteredTransactions.length} transactions found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearchQuery("");
              }}>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </Button>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No transactions found</p>
                  {(statusFilter !== "all" || typeFilter !== "all" || searchQuery !== "") && (
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setSearchQuery("");
                    }}>
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredTransactions.map((payment: any) => (
                          <tr key={payment._id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${payment.type === PAYMENT_TYPE.ADD_MONEY || payment.type === PAYMENT_TYPE.CASH_IN
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                                  }`}>
                                  {payment.type === PAYMENT_TYPE.ADD_MONEY || payment.type === PAYMENT_TYPE.CASH_IN ?
                                    <ArrowUpRight className="w-4 h-4" /> :
                                    <ArrowDownLeft className="w-4 h-4" />
                                  }
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{payment.description || `Payment #${payment.transactionId}`}</p>
                                  <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {getTypeBadge(payment.type)}
                            </td>
                            <td className="py-3 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className={`py-3 px-4 text-right font-semibold ${payment.type === PAYMENT_TYPE.ADD_MONEY || payment.type === PAYMENT_TYPE.CASH_IN ? "text-green-600" : "text-red-600"
                              }`}>
                              {formatCurrency(payment.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Payments Tab */}
        <TabsContent value="completed">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Completed Payments</CardTitle>
                <CardDescription>
                  {filteredCompletedPayments.length} completed payments found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearchQuery("");
              }}>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </Button>
            </CardHeader>
            <CardContent>
              {filteredCompletedPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <p>No completed payments found</p>
                  {(statusFilter !== "all" || typeFilter !== "all" || searchQuery !== "") && (
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setSearchQuery("");
                    }}>
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredCompletedPayments.map((payment: any) => (
                          <tr key={payment._id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{payment.description || `Payment #${payment.transactionId}`}</p>
                                  <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {getTypeBadge(payment.type)}
                            </td>
                            <td className="py-3 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-green-600">
                              {formatCurrency(payment.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Retry Payment Confirmation Dialog */}
      <Dialog open={isRetryDialogOpen} onOpenChange={setIsRetryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Retry Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to retry this payment?
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span>{getTypeBadge(selectedPayment.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Description:</span>
                <span className="text-sm text-right">{selectedPayment.description || "N/A"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRetryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRetryPayment} disabled={isRetryLoading}>
              {isRetryLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Retry"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md lg:max-w-2xl h-[80vh]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Complete Your Payment</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPaymentModalOpen(false)}
                className="h-8 w-8"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              {paymentData?.paymentUrl ? (
                <iframe
                  src={paymentData.paymentUrl}
                  className="w-full h-full border-0"
                  title="Payment Gateway"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Transaction ID: {paymentData?.transactionId}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(paymentData?.paymentUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}