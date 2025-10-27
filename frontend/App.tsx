import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

// Pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AiCourseBuilder from "@/pages/ai-course-builder";
import Courses from "@/pages/courses";
import Students from "@/pages/students";
import Teachers from "@/pages/teachers";
import Attendance from "@/pages/attendance";
import Gradebook from "@/pages/gradebook";
import Payments from "@/pages/payments";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/ai-course-builder">
        <DashboardLayout>
          <AiCourseBuilder />
        </DashboardLayout>
      </Route>
      <Route path="/courses">
        <DashboardLayout>
          <Courses />
        </DashboardLayout>
      </Route>
      <Route path="/students">
        <DashboardLayout>
          <Students />
        </DashboardLayout>
      </Route>
      <Route path="/teachers">
        <DashboardLayout>
          <Teachers />
        </DashboardLayout>
      </Route>
      <Route path="/attendance">
        <DashboardLayout>
          <Attendance />
        </DashboardLayout>
      </Route>
      <Route path="/gradebook">
        <DashboardLayout>
          <Gradebook />
        </DashboardLayout>
      </Route>
      <Route path="/payments">
        <DashboardLayout>
          <Payments />
        </DashboardLayout>
      </Route>
      <Route path="/analytics">
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path="/settings">
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  // Custom sidebar width for educational platform
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <Toaster />
          <Router />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
