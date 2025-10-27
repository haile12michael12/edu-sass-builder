import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar as CalendarIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedGrade, setSelectedGrade] = useState("grade-10");
  const [selectedSection, setSelectedSection] = useState("a");
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const students = [
    { id: "1", name: "Abebe Kebede", studentId: "STU001", avatar: null },
    { id: "2", name: "Sara Ahmed", studentId: "STU002", avatar: null },
    { id: "3", name: "Mulu Tesfaye", studentId: "STU003", avatar: null },
    { id: "4", name: "John Smith", studentId: "STU004", avatar: null },
    { id: "5", name: "Hana Dawit", studentId: "STU005", avatar: null },
    { id: "6", name: "Dawit Girma", studentId: "STU006", avatar: null },
  ];

  const attendanceOptions = [
    { value: "present", label: "Present", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20" },
    { value: "absent", label: "Absent", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/20" },
    { value: "late", label: "Late", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/20" },
    { value: "excused", label: "Excused", icon: AlertCircle, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
  ];

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSave = () => {
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${selectedGrade.replace("-", " ")} ${selectedSection.toUpperCase()} on ${date?.toLocaleDateString()} has been saved.`,
    });
  };

  const getAttendanceSummary = () => {
    const summary = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(attendanceData).forEach((status) => {
      if (status in summary) {
        summary[status as keyof typeof summary]++;
      }
    });
    return summary;
  };

  const summary = getAttendanceSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground">Mark and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date & Class Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                data-testid="calendar-attendance"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger data-testid="select-grade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`grade-${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger data-testid="select-section">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((section) => (
                      <SelectItem key={section} value={section.toLowerCase()}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
              <CardDescription>
                {date?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {attendanceOptions.map((option) => {
                const Icon = option.icon;
                const count = summary[option.value as keyof typeof summary];
                return (
                  <div key={option.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${option.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${option.color}`} />
                      </div>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                );
              })}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">{students.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                {selectedGrade.replace("-", " ")} - Section {selectedSection.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border hover-elevate"
                  data-testid={`student-${student.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.studentId}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {attendanceOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = attendanceData[student.id] === option.value;
                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, option.value)}
                          className={!isSelected ? option.bgColor : ""}
                          data-testid={`button-${option.value}-${student.id}`}
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={Object.keys(attendanceData).length === 0}
                  data-testid="button-save-attendance"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Attendance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAttendanceData({})}
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
