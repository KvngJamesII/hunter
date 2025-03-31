import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';

interface TaskCardProps {
  id: number;
  name: string;
  ownerEmail: string;
  pricePerUser: number;
  totalSlots: number;
  filledSlots: number;
}

export default function TaskCard({ id, name, ownerEmail, pricePerUser, totalSlots, filledSlots }: TaskCardProps) {
  const [_, navigate] = useLocation();
  
  // Calculate filled slots percentage (how much is filled)
  const filledPercentage = Math.min(Math.max(0, (filledSlots / totalSlots) * 100), 100);
  
  // Calculate the available slots (inverse of filled percentage) for the progress bar
  // We want to show how many slots are available, not how many are filled
  const availablePercentage = 100 - filledPercentage;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary">
      <CardContent className="p-4">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
            QR
          </div>
        </div>
        
        <h3 className="font-semibold text-center mb-2">{name}</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Task Owner:</span>
            <span>{ownerEmail}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="text-secondary font-semibold">₦{pricePerUser}</span>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Slots Left:</span>
              <span>{totalSlots - filledSlots}/{totalSlots}</span>
            </div>
            <Progress 
              value={availablePercentage} 
              className="h-2.5 bg-muted" 
              indicatorClassName="bg-gradient-to-r from-primary to-secondary" 
            />
          </div>
        </div>
        
        <Button 
          onClick={() => navigate(`/task/${id}`)} 
          className="w-full py-2 mt-4 gradient-bg gradient-shine"
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
