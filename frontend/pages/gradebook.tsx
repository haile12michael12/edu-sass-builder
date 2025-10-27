import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Download, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Gradebook() {
  const [selectedCourse, setSelectedCourse] = useState("physics-10");
  const [grades, setGrades] = useState<Record<string, Record<string, string>>>({});
  const { toast } = useToast();

  const courses = [
    { id: "physics-10", name: "Physics - Grade 10", teacher: "Dr. Abebe Kebede" },
    { id: "math-11", name: "Mathematics - Grade 11", teacher: "Prof. Sara Ahmed" },
    { id: "english-9", name: "English - Grade 9", teacher: "Mr. John Smith" },
  ];

  const assignments = [
    { id: "hw1", title: "Homework 1", maxScore: 20, weight: 10 },
    { id: "hw2", title: "Homework 2", maxScore: 20, weight: 10 },
    { id: "quiz1", title: "Quiz 1", maxScore: 30, weight: 15 },
    { id: "midterm", title: "Midterm Exam", maxScore: 100, weight: 30 },
    { id: "project", title: "Final Project", maxScore: 50, weight: 20 },
    { id: "final", title: "Final Exam", maxScore: 100, weight: 35 },
  ];

  const students = [
    { id: "1", name: "Abebe Kebede", studentId: "STU001" },
    { id: "2", name: "Sara Ahmed", studentId: "STU002" },
    { id: "3", name: "Mulu Tesfaye", studentId: "STU003" },
    { id: "4", name: "John Smith", studentId: "STU004" },
    { id: "5", name: "Hana Dawit", studentId: "STU005" },
  ];

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    setGrades({
      ...grades,
      [studentId]: {
        ...(grades[studentId] || {}),
        [assignmentId]: value,
      },
    });
  };

  const calculateTotal = (studentId: string) => {
    let totalWeighted = 0;
    let totalWeight = 0;
    
    assignments.forEach((assignment) => {
      const score = parseFloat(grades[studentId]?.[assignment.id] || "0");
      const percentage = (score / assignment.maxScore) * 100;
      totalWeighted += (percentage * assignment.weight) / 100;
      totalWeight += assignment.weight;
    });

    return totalWeight > 0 ? (totalWeighted / totalWeight) * 100 : 0;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 font-semibold";
    if (percentage >= 75) return "text-amber-600 font-semibold";
    if (percentage >= 60) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const handleSave = () => {
    toast({
      title: "Grades Saved",
      description: "All grade entries have been saved successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Gradebook is being exported to Excel.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">Manage student grades and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button data-testid="button-add-assignment">
            <Plus className="w-4 h-4 mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose the course to view and edit grades</CardDescription>
            </div>
            <div className="w-full md:w-80">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger data-testid="select-course">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gradebook Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <CardTitle>Grade Entry</CardTitle>
          </div>
          <CardDescription>
            {courses.find((c) => c.id === selectedCourse)?.name} - {courses.find((c) => c.id === selectedCourse)?.teacher}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Student</TableHead>
                  {assignments.map((assignment) => (
                    <TableHead key={assignment.id} className="text-center min-w-[120px]">
                      <div className="font-semibold">{assignment.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Max: {assignment.maxScore} | {assignment.weight}%
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center bg-muted min-w-[120px]">
                    <div className="font-semibold">Total</div>
                    <div className="text-xs text-muted-foreground">100%</div>
                  </TableHead>
                  <TableHead className="text-center bg-muted min-w-[80px]">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const total = calculateTotal(student.id);
                  const letterGrade = getLetterGrade(total);
                  
                  return (
                    <TableRow key={student.id} data-testid={`row-student-${student.id}`}>
                      <TableCell className="sticky left-0 bg-background z-10 font-medium">
                        <div>{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.studentId}</div>
                      </TableCell>
                      {assignments.map((assignment) => (
                        <TableCell key={assignment.id} className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={assignment.maxScore}
                            step="0.5"
                            value={grades[student.id]?.[assignment.id] || ""}
                            onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                            className="w-20 text-center mx-auto"
                            placeholder="--"
                            data-testid={`input-grade-${student.id}-${assignment.id}`}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center bg-muted/50">
                        <span className={getGradeColor(total)}>
                          {total.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center bg-muted/50">
                        <Badge
                          variant={total >= 60 ? "default" : "destructive"}
                          data-testid={`badge-grade-${student.id}`}
                        >
                          {letterGrade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} data-testid="button-save-grades">
              <Save className="w-4 h-4 mr-2" />
              Save All Grades
            </Button>
            <Button variant="outline" onClick={() => setGrades({})} data-testid="button-clear-grades">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.3%</div>
            <p className="text-xs text-muted-foreground">Across all assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.5%</div>
            <p className="text-xs text-muted-foreground">Sara Ahmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">46 of 50 students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">Total this semester</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
