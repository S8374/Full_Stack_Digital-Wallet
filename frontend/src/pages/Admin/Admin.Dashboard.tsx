/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Admin/Admin.Dashboard.tsx
import { useState, useEffect } from "react";
import {
  Users,
  Wallet,
  TrendingUp,
  Activity,
  CreditCard,
  UserCheck,
  UserX,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUserStatisticsQuery, useGetSystemStatisticsQuery } from "@/redux/features/admin/admin.api";
import { formatCurrency } from "@/utils/utils";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: userStats, isLoading: userStatsLoading } = useGetUserStatisticsQuery(undefined);
  const { data: systemStats, isLoading: systemStatsLoading } = useGetSystemStatisticsQuery(undefined);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalAgents: 0,
    pendingAgents: 0,
    totalTransactions: 0,
    totalWallets: 0,
    totalBalance: 0,
    todayTransactions: 0
  });

  useEffect(() => {
    if (userStats?.data && systemStats?.data) {
      setStats({
        totalUsers: userStats.data.totalUsers,
        activeUsers: userStats.data.activeUsers,
        blockedUsers: userStats.data.blockedUsers,
        totalAgents: userStats.data.totalAgents,
        pendingAgents: userStats.data.pendingAgents,
        totalTransactions: systemStats.data.totalTransactions,
        totalWallets: systemStats.data.totalWallets,
        totalBalance: systemStats.data.totalBalance,
        todayTransactions: systemStats.data.todayTransactions
      });
    }
  }, [userStats, systemStats]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    description
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex dashboard-stats flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {trendValue}
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  if (userStatsLoading || systemStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the admin dashboard</p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Link to={'/'}>
            <Button variant="outline"> Go Home</Button>
          </Link>

        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={UserCheck}
          description={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`}
        />
        <StatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={UserX}
          trend="down"
          trendValue="-2% from last month"
        />
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={Users}
          description={`${stats.pendingAgents} pending approval`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={CreditCard}
          trend="up"
          trendValue="+24% from last month"
        />
        <StatCard
          title="Today's Transactions"
          value={stats.todayTransactions}
          icon={Activity}
          description="Transactions processed today"
        />
        <StatCard
          title="Total Wallets"
          value={stats.totalWallets}
          icon={Wallet}
        />
        <StatCard
          title="System Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={TrendingUp}
          description="Total balance across all wallets"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              User statistics and system performance
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">User Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Regular Users</span>
                    <span className="font-semibold">
                      {stats.totalUsers - stats.totalAgents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agents</span>
                    <span className="font-semibold">{stats.totalAgents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active</span>
                    <span className="font-semibold text-green-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blocked</span>
                    <span className="font-semibold text-red-600">{stats.blockedUsers}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Pending Agents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor Transactions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet Management
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              System events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">System updated to v2.1.0</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New agent registration</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Suspicious transaction detected</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Wallet blocked by admin</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}