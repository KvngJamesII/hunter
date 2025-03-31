import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Users, 
  CreditCard, 
  ClipboardList, 
  CheckCircle, 
  Download,
  CalendarRange,
  Loader2
} from "lucide-react";

interface ReportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function AdminReports() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string>('users');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fileFormat, setFileFormat] = useState<string>('csv');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const reportOptions: ReportOption[] = [
    {
      id: 'users',
      name: 'Users Report',
      description: 'Details of all users including registration date, referrals, and activity',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'tasks',
      name: 'Tasks Report',
      description: 'Summary of all tasks including completion rates and user participation',
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      id: 'transactions',
      name: 'Transactions Report',
      description: 'Financial transactions including deposits, withdrawals, and task payments',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'completions',
      name: 'Task Completions Report',
      description: 'Detailed record of all task submissions and their approval/rejection status',
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];
  
  // Find the currently selected report option
  const currentReport = reportOptions.find(option => option.id === selectedReport);
  
  // Generate the report
  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing date range",
        description: "Please select both a start and end date for the report.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Here we would call the API to generate the report
      // const response = await fetch(`/api/admin/reports/${selectedReport}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ startDate, endDate, format: fileFormat })
      // });
      
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example download logic - this would be replaced with actual file download
      toast({
        title: "Report generated successfully",
        description: `Your ${currentReport?.name} has been generated and is ready to download.`
      });
      
      // Simulated download - this would be replaced with actual file download code
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.${fileFormat}`;
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Create and download detailed reports for platform data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="report-type">Report Type</Label>
              <Select
                value={selectedReport}
                onValueChange={setSelectedReport}
              >
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {currentReport && (
                <p className="text-sm text-muted-foreground">{currentReport.description}</p>
              )}
            </div>
            
            <div className="grid gap-3">
              <div className="flex items-center">
                <CalendarRange className="mr-2 h-4 w-4" />
                <Label>Date Range</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="end-date" className="text-xs">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="file-format">File Format</Label>
              <Select
                value={fileFormat}
                onValueChange={setFileFormat}
              >
                <SelectTrigger id="file-format">
                  <SelectValue placeholder="Select a file format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports are available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center text-muted-foreground py-8">
              <FileText className="mx-auto h-10 w-10 mb-2" />
              <p>No recent reports found</p>
              <p className="text-sm">Generated reports will appear here for easy access</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}