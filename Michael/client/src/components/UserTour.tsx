import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useAuthContext } from '@/context/AuthContext';
import { useLocation } from 'wouter';

interface UserTourProps {
  isTourOpen: boolean;
  setIsTourOpen: (isOpen: boolean) => void;
}

export default function UserTour({ isTourOpen, setIsTourOpen }: UserTourProps) {
  const [location] = useLocation();
  const { user } = useAuthContext();
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  
  // Define the steps based on the current location
  useEffect(() => {
    if (location === '/') {
      setTourSteps([
        {
          target: '.gradient-text',
          content: 'Welcome to QuicReF! This is where you can find and complete tasks to earn money.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '.nav-circle:nth-child(1)',
          content: 'Access your wallet to check your balance and make withdrawals.',
          disableBeacon: true,
          placement: 'top',
        },
        {
          target: '.nav-circle:nth-child(2)',
          content: 'View your tasks, including ones you created and ones you submitted.',
          disableBeacon: true,
          placement: 'top',
        },
        {
          target: '.nav-circle.large',
          content: 'Create new tasks for other users to complete and earn.',
          disableBeacon: true,
          placement: 'top',
        },
        {
          target: '.nav-circle:nth-child(4)',
          content: 'Check your notifications here.',
          disableBeacon: true,
          placement: 'top',
        }
      ]);
    } else if (location === '/my-tasks') {
      setTourSteps([
        {
          target: '.tabs-list',
          content: 'Switch between tasks you need to review and tasks you\'ve submitted.',
          disableBeacon: true,
          placement: 'bottom',
        }
      ]);
    } else if (location === '/wallet') {
      setTourSteps([
        {
          target: '.wallet-balance',
          content: 'This is your current balance.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '.wallet-buttons',
          content: 'Deposit funds or withdraw your earnings here.',
          disableBeacon: true,
          placement: 'top',
        }
      ]);
    }
  }, [location]);
  
  // Handle tour callbacks
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    // Use string comparison instead of enum
    if (status === 'finished' || status === 'skipped') {
      setIsTourOpen(false);
      
      // Store that user has seen the tour
      if (user) {
        localStorage.setItem(`tour-completed-${user.id}`, 'true');
      }
    }
  };
  
  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={isTourOpen}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={tourSteps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--primary)',
          textColor: 'var(--foreground)',
          backgroundColor: 'var(--background)',
        },
      }}
    />
  );
}