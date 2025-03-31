import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useAuthContext } from '@/context/AuthContext';

export default function MyTasksSection() {
  const { user } = useAuthContext();
  const userId = user?.id;
  
  const { 
    pendingReviews, 
    isLoadingReviews, 
    reviewSubmission,
    userSubmissions,
    isLoadingUserSubmissions
  } = useTasks(userId);
  
  // Handle empty arrays with proper typing
  const reviewsArray = Array.isArray(pendingReviews) ? pendingReviews : [];
  const submissionsArray = Array.isArray(userSubmissions) ? userSubmissions : [];
  
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Function to handle viewing a submission
  const handleViewSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };
  
  // Function to approve a submission
  const handleApprove = (submissionId: number) => {
    if (!userId) return;
    reviewSubmission({ 
      submissionId, 
      status: 'approved', 
      reviewerId: userId 
    });
    setIsDialogOpen(false);
  };
  
  // Function to reject a submission
  const handleReject = (submissionId: number) => {
    if (!userId) return;
    reviewSubmission({ 
      submissionId, 
      status: 'rejected', 
      reviewerId: userId 
    });
    setIsDialogOpen(false);
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="mt-8 mb-6">
      <h2 className="text-lg font-semibold mb-4">My Tasks</h2>
      
      <Tabs defaultValue="review" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="review" className="relative">
            To Review
            {reviewsArray.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center text-white">
                {reviewsArray.length > 9 ? '9+' : reviewsArray.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>
        
        {/* Tasks that need review */}
        <TabsContent value="review">
          {isLoadingReviews ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviewsArray.length > 0 ? (
            <div className="space-y-4">
              {reviewsArray.map((review: any) => (
                <Card key={review.submission.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{review.task.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Submitted: {formatDate(review.submission.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm flex items-center justify-between">
                      <span>By: {review.submission.userEmail}</span>
                      {getStatusBadge(review.submission.status)}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewSubmission(review)}
                      className="w-full"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Submission
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2 opacity-30">🔍</div>
              <p className="text-muted-foreground">No pending reviews</p>
            </div>
          )}
        </TabsContent>
        
        {/* User's submissions */}
        <TabsContent value="submissions">
          {isLoadingUserSubmissions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : submissionsArray.length > 0 ? (
            <div className="space-y-4">
              {submissionsArray.map((submission: any) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{submission.taskName}</CardTitle>
                    <CardDescription className="text-xs">
                      Submitted: {formatDate(submission.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          Price: <span className="font-semibold">₦{submission.taskPrice}</span>
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2 opacity-30">📝</div>
              <p className="text-muted-foreground">You haven't submitted any tasks yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog for submission details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review the proof of task completion below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <>
              <div className="py-4">
                <h4 className="font-medium mb-2">Task: {selectedSubmission.task.name}</h4>
                <div className="bg-secondary p-3 rounded-md my-2">
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.submission.proofText}</p>
                </div>
                
                {selectedSubmission.submission.proofImage && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Proof Image:</h4>
                    <img 
                      src={selectedSubmission.submission.proofImage} 
                      alt="Proof" 
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(selectedSubmission.submission.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleApprove(selectedSubmission.submission.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}