import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, CheckCircle, Loader2, FileText, Target } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AiCourseBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: "",
    grade: "",
    subject: "",
    duration: "",
    additionalNotes: "",
  });
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/ai/generate-course", {
        ...data,
        schoolId: "demo-school-id", // In real app, get from auth context
        userId: "demo-admin-id", // In real app, get from auth context
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedCourse(data);
      setStep(3);
      toast({
        title: "Course Generated!",
        description: "Your AI-powered course structure is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate course",
        variant: "destructive",
      });
      setStep(1); // Go back to form on error
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Serialize generatedCourse to ensure it's plain JSON (no functions, dates, etc.)
      const serializedSyllabus = JSON.parse(JSON.stringify(generatedCourse));
      
      const courseData = {
        schoolId: "demo-school-id", // In real app, get from auth context
        teacherId: "demo-admin-id", // In real app, get from auth context
        title: generatedCourse.title || formData.topic,
        description: generatedCourse.description || `${formData.subject} course for ${formData.grade}`,
        subject: formData.subject,
        grade: formData.grade,
        status: "draft" as const,
        syllabus: serializedSyllabus,
        totalLessons: generatedCourse.totalLessons || 0,
      };
      const response = await apiRequest("POST", "/api/courses", courseData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Course Saved!",
        description: "Your course has been created successfully.",
      });
      setStep(1);
      setFormData({ topic: "", grade: "", subject: "", duration: "", additionalNotes: "" });
      setGeneratedCourse(null);
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save course",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate(formData);
    setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Course Architect</h1>
          <p className="text-muted-foreground">Generate complete course structures with AI</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {[
          { num: 1, label: "Course Details" },
          { num: 2, label: "AI Generation" },
          { num: 3, label: "Review & Save" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-sm mt-2">{s.label}</span>
            </div>
            {idx < 2 && (
              <div
                className={`h-0.5 flex-1 ${step > s.num ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Course Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Course</CardTitle>
            <CardDescription>
              Provide basic information and our AI will create a complete course structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Course Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Introduction to Physics"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  data-testid="input-topic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger id="subject" data-testid="select-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="amharic">Amharic</SelectItem>
                    <SelectItem value="afaan-oromo">Afaan Oromo</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger id="grade" data-testid="select-grade">
                    <SelectValue placeholder="Select grade" />
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
                <Label htmlFor="duration">Course Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration" data-testid="select-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months (Semester)</SelectItem>
                    <SelectItem value="12-months">12 Months (Full Year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements, topics to focus on, or teaching style preferences..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={4}
                data-testid="textarea-notes"
              />
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={!formData.topic || !formData.subject || !formData.grade}
              data-testid="button-generate"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Course with AI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Generating */}
      {step === 2 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold">Generating Your Course</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our AI is creating a comprehensive course structure with lessons, objectives, and assessments...
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-8">
                <Badge variant="secondary">Analyzing topic</Badge>
                <Badge variant="secondary">Creating syllabus</Badge>
                <Badge variant="secondary">Planning lessons</Badge>
                <Badge variant="secondary">Designing assessments</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Save */}
      {step === 3 && generatedCourse && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Generated Course</CardTitle>
              <CardDescription>
                Your AI-generated course is ready. Review and customize before saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">Lessons</span>
                  </div>
                  <p className="text-2xl font-bold">{generatedCourse.totalLessons || 24}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">Objectives</span>
                  </div>
                  <p className="text-2xl font-bold">{generatedCourse.objectives?.length || 12}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium">Assessments</span>
                  </div>
                  <p className="text-2xl font-bold">{generatedCourse.assessments?.length || 6}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Course Outline</h4>
                <div className="space-y-2">
                  {(generatedCourse.outline || [
                    "Week 1-2: Introduction and Fundamentals",
                    "Week 3-4: Core Concepts and Principles",
                    "Week 5-6: Advanced Topics and Applications",
                    "Week 7-8: Practical Exercises and Projects",
                    "Week 9-10: Review and Assessment Preparation",
                  ]).map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setGeneratedCourse(null);
                  }}
                  data-testid="button-regenerate"
                >
                  Regenerate
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  data-testid="button-save-course"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Course
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
