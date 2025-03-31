import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';

interface TourContextType {
  isTourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { user, isLoading } = useAuthContext();
  
  // Check if user is new and should see the tour
  useEffect(() => {
    if (!isLoading && user) {
      const hasTourCompleted = localStorage.getItem(`tour-completed-${user.id}`);
      
      if (!hasTourCompleted) {
        // Give a little delay to allow the page to fully render
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading]);
  
  const startTour = () => {
    setIsTourOpen(true);
  };
  
  const closeTour = () => {
    setIsTourOpen(false);
    
    if (user) {
      localStorage.setItem(`tour-completed-${user.id}`, 'true');
    }
  };
  
  return (
    <TourContext.Provider
      value={{
        isTourOpen,
        startTour,
        closeTour
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  
  return context;
}