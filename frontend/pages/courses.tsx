import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, Search, Users, Clock, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with actual API call
  const courses = [
    {
      id: "1",
      title: "Introduction to Physics",
      description: "Comprehensive physics course covering mechanics, thermodynamics, and electromagnetism",
      subject: "Physics",
      grade: "Grade 10",
      thumbnail: null,
      status: "published",
      students: 45,
      lessons: 24,
      teacher: "Dr. Abebe Kebede",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Advanced Mathematics",
      description: "Calculus, algebra, and geometry for advanced learners",
      subject: "Mathematics",
      grade: "Grade 11",
      thumbnail: null,
      status: "published",
      students: 38,
      lessons: 32,
      teacher: "Prof. Sara Ahmed",
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      title: "English Literature",
      description: "Classical and modern literature analysis",
      subject: "English",
      grade: "Grade 9",
      thumbnail: null,
      status: "draft",
      students: 0,
      lessons: 18,
      teacher: "Mr. John Smith",
      createdAt: "2024-03-10",
    },
    {
      id: "4",
      title: "Ethiopian History",
      description: "Comprehensive study of Ethiopian history from ancient to modern times",
      subject: "History",
      grade: "Grade 12",
      thumbnail: null,
      status: "published",
      students: 52,
      lessons: 28,
      teacher: "Dr. Mulu Tesfaye",
      createdAt: "2024-01-25",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || course.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your school's courses</p>
        </div>
        <Link href="/ai-course-builder">
          <Button data-testid="button-create-course">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger data-testid="select-filter-subject">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger data-testid="select-filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover-elevate flex flex-col" data-testid={`card-course-${course.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={course.status === "published" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid={`button-menu-${course.id}`}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem data-testid={`button-edit-${course.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" data-testid={`button-delete-${course.id}`}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.subject} • {course.grade}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.students} students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.lessons} lessons</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Teacher: <span className="font-medium text-foreground">{course.teacher}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" data-testid={`button-view-${course.id}`}>
                View Course
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or create a new course
            </p>
            <Link href="/ai-course-builder">
              <Button data-testid="button-create-first-course">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
