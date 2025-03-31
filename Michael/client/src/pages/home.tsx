import { useState } from 'react';
import { Link } from 'wouter';
import { User, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useAuthContext } from '@/context/AuthContext';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user } = useAuthContext();
  const { tasks, isLoadingTasks } = useTasks(user?.id);
  
  // Handle empty array with proper typing
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  
  return (
    <div>
      {/* Header */}
      <header className="bg-card py-4 px-4 flex items-center justify-between shadow-md">
        <Link href="/profile" className="w-8 h-8 flex items-center justify-center">
          <User className="h-5 w-5 text-foreground" />
        </Link>
        
        <h1 className="text-xl font-bold gradient-text">QuicReF</h1>
        
        <div className="flex items-center text-secondary">
          <span className="mr-1">🏦:</span>
          <span className="font-bold">₦{user?.withdrawableBalance || 0}</span>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Create Task Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Available Tasks</h2>
          <Link href="/create-task">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </Link>
        </div>
        
        {/* Available Tasks Section */}
        {isLoadingTasks ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasksArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasksArray.map((task: any) => (
              <TaskCard
                key={task.id}
                id={task.id}
                name={task.name}
                ownerEmail={task.ownerEmail}
                pricePerUser={task.pricePerUser}
                totalSlots={task.totalSlots}
                filledSlots={task.filledSlots}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="text-5xl mb-2 opacity-30">📋</div>
            <p className="text-muted-foreground">No available tasks for now</p>
          </div>
        )}
        

      </main>
    </div>
  );
}
