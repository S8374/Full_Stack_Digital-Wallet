// src/components/charts/ChartSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function ChartSection() {
  return (
    <div className="charts-section grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-blue-600">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Revenue Chart</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Distribution</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-green-600">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">User Distribution Chart</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-purple-600">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Performance Chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}