import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { TourProvider } from '@/context/TourContext';
import Layout from '@/components/Layout';
import UserTour from '@/components/UserTour';
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import TaskDetail from "@/pages/task-detail";
import Review from "@/pages/review";
import CreateTask from "@/pages/create-task";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import MyTasks from "@/pages/my-tasks";
import Admin from "@/pages/admin";

function Router() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { user, isLoading } = useAuthContext();
  const [location] = useLocation();
  
  // Check if user should see the tour
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
  }, [user, isLoading, location]);
  
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/" component={Home} />
          <Route path="/task/:id" component={TaskDetail} />
          <Route path="/review/:id" component={Review} />
          <Route path="/create-task" component={CreateTask} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/profile" component={Profile} />
          <Route path="/my-tasks" component={MyTasks} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <UserTour isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TourProvider>
          <Router />
          <Toaster />
        </TourProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
