import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Courses",
      value: "48",
      change: "+3",
      trend: "up",
      icon: BookOpen,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Teachers",
      value: "87",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Revenue (ETB)",
      value: "245,680",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "enrollment",
      message: "15 new students enrolled in Grade 10 Mathematics",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "course",
      message: "Physics course curriculum updated with AI suggestions",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "payment",
      message: "Payment reminder sent to 45 parents",
      time: "6 hours ago",
      status: "warning",
    },
    {
      id: 4,
      type: "attendance",
      message: "Attendance marked for all Grade 9 classes",
      time: "1 day ago",
      status: "success",
    },
  ];

  const pendingTasks = [
    { id: 1, title: "Review 12 pending grade submissions", priority: "high" },
    { id: 2, title: "Approve 3 new teacher applications", priority: "medium" },
    { id: 3, title: "Update school calendar for next semester", priority: "low" },
    { id: 4, title: "Process 8 scholarship applications", priority: "high" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent-Teacher Meeting", date: "Tomorrow, 2:00 PM", type: "meeting" },
    { id: 2, title: "Grade 12 Final Exams Begin", date: "May 15, 2025", type: "exam" },
    { id: 3, title: "Teacher Training Workshop", date: "May 20, 2025", type: "training" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
        <p className="text-muted-foreground">Here's what's happening in your school today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-elevate" data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid={`text-stat-value-${index}`}>{stat.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover-elevate"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success" ? "bg-green-500" :
                    activity.status === "warning" ? "bg-amber-500" :
                    "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" data-testid="button-add-student">
              <GraduationCap className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-create-course">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Course
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-mark-attendance">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-process-payment">
              <DollarSign className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Pending Tasks</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                  data-testid={`task-${task.id}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      task.priority === "high" ? "text-red-500" :
                      task.priority === "medium" ? "text-amber-500" :
                      "text-blue-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <Badge
                        variant={task.priority === "high" ? "destructive" : "secondary"}
                        className="mt-1 text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Upcoming Events</CardTitle>
            <CardDescription>Calendar highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                  data-testid={`event-${event.id}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
