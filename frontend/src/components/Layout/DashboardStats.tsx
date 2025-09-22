// src/components/dashboard/DashboardStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, CreditCard } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalBalance: number;
    totalTransactions: number;
    activeUsers: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Balance",
      value: `$${stats.totalBalance.toLocaleString()}`,
      icon: Wallet,
      change: "+8%",
      trend: "up",
    },
    {
      title: "Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: CreditCard,
      change: "+23%",
      trend: "up",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      change: "+5%",
      trend: "up",
    },
  ];

  return (
    <div className="dashboard-stats grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {card.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}