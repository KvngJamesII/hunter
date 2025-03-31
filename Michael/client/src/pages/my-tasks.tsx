import { useAuthContext } from '@/context/AuthContext';
import MyTasksSection from '@/components/MyTasksSection';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function MyTasks() {
  const { user } = useAuthContext();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p>Please login to view your tasks</p>
            <Link href="/login" className="text-primary block mt-4">
              Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">My Tasks</h1>
      </div>
      
      <MyTasksSection />
    </div>
  );
}