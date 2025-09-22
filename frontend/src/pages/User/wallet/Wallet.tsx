// src/pages/User/Wallet/Wallet.tsx
import { useState } from "react";
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  TrendingUp, 
  Download, 
  Upload, 
  History,
  Shield,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyWalletQuery } from "@/redux/features/wallet/wallet.api";

export default function Wallet() {
  const { data: walletData, isLoading, error, refetch } = useGetMyWalletQuery(undefined);
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number, currency: string = "BDT") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'system': return 'System Wallet';
      case 'user': return 'Personal Wallet';
      case 'agent': return 'Agent Wallet';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Wallet Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Unable to load wallet information. Please try again.
          </p>
          <Button onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const wallet = walletData?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            My Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your funds and track your financial activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <Upload className="w-6 h-6 text-blue-500" />
          <span>Add Funds</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <Download className="w-6 h-6 text-green-500" />
          <span>Withdraw</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <History className="w-6 h-6 text-purple-500" />
          <span>Transaction History</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(wallet?.balance || 0, wallet?.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet?.dailySpent || 0, wallet?.currency)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress 
                value={(wallet?.dailySpent || 0) / (wallet?.dailyLimit || 1) * 100} 
                className="h-2"
              />
              <span className="text-xs text-muted-foreground">
                {Math.round((wallet?.dailySpent || 0) / (wallet?.dailyLimit || 1) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spent</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet?.monthlySpent || 0, wallet?.currency)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress 
                value={(wallet?.monthlySpent || 0) / (wallet?.monthlyLimit || 1) * 100} 
                className="h-2"
              />
              <span className="text-xs text-muted-foreground">
                {Math.round((wallet?.monthlySpent || 0) / (wallet?.monthlyLimit || 1) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusVariant(wallet?.status || '')}>
                {wallet?.status?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {getTypeLabel(wallet?.type || '')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm opacity-80">Current Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(wallet?.balance || 0, wallet?.currency)}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 opacity-80" />
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Add Money
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Send Money
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Daily Limit</span>
                  <span className="font-semibold">
                    {formatCurrency(wallet?.dailyLimit || 0, wallet?.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Limit</span>
                  <span className="font-semibold">
                    {formatCurrency(wallet?.monthlyLimit || 0, wallet?.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Minimum Balance</span>
                  <span className="font-semibold">
                    {formatCurrency(wallet?.minBalance || 0, wallet?.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Spending Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Daily Spending</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(wallet?.dailySpent || 0, wallet?.currency)} / {formatCurrency(wallet?.dailyLimit || 0, wallet?.currency)}
                  </span>
                </div>
                <Progress 
                  value={(wallet?.dailySpent || 0) / (wallet?.dailyLimit || 1) * 100} 
                  className="h-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Monthly Spending</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(wallet?.monthlySpent || 0, wallet?.currency)} / {formatCurrency(wallet?.monthlyLimit || 0, wallet?.currency)}
                  </span>
                </div>
                <Progress 
                  value={(wallet?.monthlySpent || 0) / (wallet?.monthlyLimit || 1) * 100} 
                  className="h-3"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Limits reset on: {formatDate(wallet?.lastResetDate || new Date().toISOString())}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wallet ID</label>
                    <p className="font-mono text-sm">{wallet?._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="font-mono text-sm">{wallet?.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Currency</label>
                    <p className="font-semibold">{wallet?.currency}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p>{formatDate(wallet?.createdAt || '')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p>{formatDate(wallet?.updatedAt || '')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <Badge variant="outline">{getTypeLabel(wallet?.type || '')}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity found</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}