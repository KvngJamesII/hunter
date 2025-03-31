import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminLog {
  id: number;
  adminId: number;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: number;
  details: string;
  createdAt: string;
}

export default function AdminLogs() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  
  const { user } = useAuthContext();
  
  const { data, isLoading, error } = useQuery<{ logs: AdminLog[], totalPages: number }>({
    queryKey: ['/api/admin/logs', page, searchQuery, actionFilter],
    queryFn: () => apiRequest(`/api/admin/logs?adminId=${user?.id}&page=${page}&search=${searchQuery}&action=${actionFilter}`),
    enabled: !!user?.id && user?.isAdmin,
    onSuccess: (data) => {
      // Success handler
      console.log('Logs loaded successfully:', data);
    },
    onError: (error) => {
      console.error('Error loading logs:', error);
      toast({
        title: "Error loading admin logs",
        description: "Could not load the admin activity logs. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Format the timestamp for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Placeholder for log data while API endpoint is implemented
  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;
  
  // Action types for the filter
  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'login', label: 'Login' },
    { value: 'user_update', label: 'User Update' },
    { value: 'deposit_approval', label: 'Deposit Approval' },
    { value: 'withdraw_approval', label: 'Withdrawal Approval' },
    { value: 'user_ban', label: 'User Ban' },
    { value: 'balance_update', label: 'Balance Update' },
    { value: 'settings_change', label: 'Settings Change' }
  ];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Activity Logs</CardTitle>
          <CardDescription>
            Track and monitor all administrative actions on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={actionFilter}
                onValueChange={setActionFilter}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Loading logs...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Error loading logs. Please try again.</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs found. Admin actions will appear here.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead className="hidden md:table-cell">Details</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.adminEmail}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              log.action.includes('approval') ? 'bg-green-100 text-green-800' :
                              log.action.includes('ban') ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell>
                            {log.targetType} #{log.targetId}
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                            {log.details}
                          </TableCell>
                          <TableCell>{formatDate(log.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && page < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink className="cursor-default">
                          ...
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {totalPages > 5 && page < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(totalPages)}
                          isActive={page === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}