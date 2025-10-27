import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  Download,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for charts
  const enrollmentData = [
    { month: "Jan", students: 1100 },
    { month: "Feb", students: 1150 },
    { month: "Mar", students: 1234 },
    { month: "Apr", students: 1290 },
    { month: "May", students: 1340 },
    { month: "Jun", students: 1380 },
  ];

  const attendanceData = [
    { day: "Mon", rate: 95 },
    { day: "Tue", rate: 94 },
    { day: "Wed", rate: 96 },
    { day: "Thu", rate: 93 },
    { day: "Fri", rate: 92 },
  ];

  const courseCompletionData = [
    { name: "Physics", completion: 78 },
    { name: "Math", completion: 85 },
    { name: "English", completion: 72 },
    { name: "History", completion: 80 },
    { name: "Chemistry", completion: 68 },
  ];

  const gradeDistribution = [
    { grade: "A", students: 245, color: "#10b981" },
    { grade: "B", students: 412, color: "#3b82f6" },
    { grade: "C", students: 328, color: "#f59e0b" },
    { grade: "D", students: 156, color: "#f97316" },
    { grade: "F", students: 93, color: "#ef4444" },
  ];

  const performanceMetrics = [
    {
      title: "Average Performance",
      value: "85.3%",
      change: "+3.2%",
      trend: "up",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Course Completion",
      value: "76.8%",
      change: "+5.1%",
      trend: "up",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "-0.8%",
      trend: "down",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg. Study Time",
      value: "4.2 hrs",
      change: "+0.5 hrs",
      trend: "up",
      icon: Clock,
      color: "text-amber-600",
    },
  ];

  const insights = [
    {
      type: "success",
      title: "Student Engagement Up",
      description: "Average course completion rate increased by 5% this month",
    },
    {
      type: "warning",
      title: "Grade 9 Attendance Low",
      description: "Friday attendance in Grade 9 Section C is below 85%",
    },
    {
      type: "info",
      title: "AI Recommendation",
      description: "Consider additional tutoring for students scoring below 60% in Mathematics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Performance insights and data analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40" data-testid="select-timerange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-${metric.color.split('-')[1]}-100 dark:bg-${metric.color.split('-')[1]}-900/20 flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
            <CardDescription>Monthly student growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Rate</CardTitle>
            <CardDescription>Daily attendance percentage this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rate" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
            <CardDescription>Completion percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseCompletionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Student performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.grade}: ${entry.students}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {gradeDistribution.map((item) => (
                  <div key={item.grade} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">Grade {item.grade}:</span>
                    <span className="text-sm text-muted-foreground">{item.students} students</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Automated recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border hover-elevate"
              >
                <Badge
                  variant={
                    insight.type === "success" ? "default" :
                    insight.type === "warning" ? "secondary" : "secondary"
                  }
                  className={
                    insight.type === "success" ? "bg-green-600" :
                    insight.type === "warning" ? "bg-amber-600" : ""
                  }
                >
                  {insight.type}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
            <CardDescription>Highest average grades this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sara Ahmed", grade: 96.5, rank: 1 },
                { name: "Abebe Kebede", grade: 94.2, rank: 2 },
                { name: "Mulu Tesfaye", grade: 92.8, rank: 3 },
                { name: "Hana Dawit", grade: 91.5, rank: 4 },
                { name: "Dawit Girma", grade: 90.3, rank: 5 },
              ].map((student) => (
                <div key={student.rank} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      student.rank === 1 ? "bg-amber-500 text-white" :
                      student.rank === 2 ? "bg-gray-400 text-white" :
                      student.rank === 3 ? "bg-amber-700 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {student.rank}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{student.grade}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Courses</CardTitle>
            <CardDescription>Highest enrollment this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { course: "Introduction to Physics", students: 125 },
                { course: "Advanced Mathematics", students: 118 },
                { course: "English Literature", students: 105 },
                { course: "Ethiopian History", students: 98 },
                { course: "Chemistry Basics", students: 87 },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">{course.course}</div>
                    <div className="text-sm text-muted-foreground">{course.students} students</div>
                  </div>
                  <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(course.students / 125) * 100}%` }}
                    />
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
