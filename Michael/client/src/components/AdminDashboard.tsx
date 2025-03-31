import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, CreditCard, BarChart3, ClipboardList } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  walletBalance: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
    onSuccess: (data) => {
      // Success handler
    },
    onError: (error) => {
      toast({
        title: "Error loading dashboard statistics",
        description: "Could not load the admin dashboard statistics. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const { data: activityData, isLoading: isLoadingActivity } = useQuery<{ date: string; tasks: number; users: number; transactions: number }[]>({
    queryKey: ['/api/admin/dashboard/activity'],
    onSuccess: (data) => {
      // Success handler
    },
    onError: (error) => {
      toast({
        title: "Error loading activity data",
        description: "Could not load the activity data. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const { data: transactionData, isLoading: isLoadingTransactions } = useQuery<{ name: string; value: number }[]>({
    queryKey: ['/api/admin/dashboard/transactions'],
    onSuccess: (data) => {
      // Success handler
    },
    onError: (error) => {
      toast({
        title: "Error loading transaction data",
        description: "Could not load the transaction data. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mock data while API endpoints are being implemented
  const tempStats: DashboardStats = stats || {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalTransactions: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    walletBalance: 0
  };
  
  const tempActivityData = activityData || [];
  const tempTransactionData = transactionData || [];
  
  // Color configurations for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const isLoading = isLoadingStats || isLoadingActivity || isLoadingTransactions;
  
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      <p className="text-muted-foreground">
        Overview of platform activity, user statistics, and financial data.
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tempStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {tempStats.newUsers} new users this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tasks
                  </CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tempStats.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {tempStats.completedTasks} completed, {tempStats.pendingTasks} pending
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Transactions
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tempStats.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">
                    {tempStats.totalDeposits} deposits, {tempStats.totalWithdrawals} withdrawals
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Platform Balance
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{tempStats.walletBalance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total platform funds
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>
                    Active vs. Inactive users on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Active Users', value: tempStats.activeUsers },
                            { name: 'Inactive Users', value: tempStats.totalUsers - tempStats.activeUsers }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Active Users', value: tempStats.activeUsers },
                            { name: 'Inactive Users', value: tempStats.totalUsers - tempStats.activeUsers }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Task Status</CardTitle>
                  <CardDescription>
                    Completed vs. Pending task distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed Tasks', value: tempStats.completedTasks },
                            { name: 'Pending Tasks', value: tempStats.pendingTasks }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Completed Tasks', value: tempStats.completedTasks },
                            { name: 'Pending Tasks', value: tempStats.pendingTasks }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>
                  Daily activity trends for the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tempActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" name="New Users" fill="#8884d8" />
                      <Bar dataKey="tasks" name="New Tasks" fill="#82ca9d" />
                      <Bar dataKey="transactions" name="Transactions" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Distribution</CardTitle>
                <CardDescription>
                  Breakdown of transaction types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tempTransactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value }) => `${name}: ₦${value}`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tempTransactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}