// Reference: javascript_stripe blueprint for payment integration
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import {
  insertSchoolSchema,
  insertUserSchema,
  insertCourseSchema,
  insertLessonSchema,
  insertStudentSchema,
  insertEnrollmentSchema,
  insertAttendanceSchema,
  insertGradeSchema,
  insertPaymentSchema,
  insertAiCourseGenerationSchema,
} from "@shared/schema";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Schools API
  app.get("/api/schools/:id", async (req, res) => {
    try {
      const school = await storage.getSchool(req.params.id);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/schools", async (req, res) => {
    try {
      const validatedData = insertSchoolSchema.parse(req.body);
      const school = await storage.createSchool(validatedData);
      res.status(201).json(school);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/schools/:id", async (req, res) => {
    try {
      const school = await storage.updateSchool(req.params.id, req.body);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Users API
  app.get("/api/schools/:schoolId/users", async (req, res) => {
    try {
      const users = await storage.getUsersBySchool(req.params.schoolId);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Courses API
  app.get("/api/schools/:schoolId/courses", async (req, res) => {
    try {
      const courses = await storage.getCoursesBySchool(req.params.schoolId);
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.updateCourse(req.params.id, req.body);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      await storage.deleteCourse(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Lessons API
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByCourse(req.params.courseId);
      res.json(lessons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const validatedData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(validatedData);
      res.status(201).json(lesson);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Students API
  app.get("/api/schools/:schoolId/students", async (req, res) => {
    try {
      const students = await storage.getStudentsBySchool(req.params.schoolId);
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Enrollments API
  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByCourse(req.params.courseId);
      res.json(enrollments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const validatedData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(validatedData);
      res.status(201).json(enrollment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Attendance API
  app.get("/api/students/:studentId/attendance", async (req, res) => {
    try {
      const attendanceRecords = await storage.getAttendanceByStudent(req.params.studentId);
      res.json(attendanceRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/schools/:schoolId/attendance", async (req, res) => {
    try {
      const { date } = req.query;
      if (!date || typeof date !== "string") {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      const attendanceRecords = await storage.getAttendanceBySchoolAndDate(
        req.params.schoolId,
        new Date(date)
      );
      res.json(attendanceRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const record = await storage.createAttendance(validatedData);
      res.status(201).json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Grades API
  app.get("/api/students/:studentId/grades", async (req, res) => {
    try {
      const gradesRecords = await storage.getGradesByStudent(req.params.studentId);
      res.json(gradesRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/courses/:courseId/grades", async (req, res) => {
    try {
      const gradesRecords = await storage.getGradesByCourse(req.params.courseId);
      res.json(gradesRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/grades", async (req, res) => {
    try {
      const validatedData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(validatedData);
      res.status(201).json(grade);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/grades/:id", async (req, res) => {
    try {
      const grade = await storage.updateGrade(req.params.id, req.body);
      if (!grade) {
        return res.status(404).json({ message: "Grade not found" });
      }
      res.json(grade);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payments API
  app.get("/api/schools/:schoolId/payments", async (req, res) => {
    try {
      const paymentsRecords = await storage.getPaymentsBySchool(req.params.schoolId);
      res.json(paymentsRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing is not configured" });
    }
    
    try {
      const { amount } = req.body;
      if (!amount || typeof amount !== "number") {
        return res.status(400).json({ message: "Amount is required and must be a number" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // AI Course Generation API
  app.post("/api/ai/generate-course", async (req, res) => {
    try {
      // Check if OpenAI is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ message: "AI course generation is not configured. Please set OPENAI_API_KEY." });
      }

      const { generateCourseContent } = await import("./openai");
      const { topic, grade, subject, duration, additionalNotes, schoolId, userId } = req.body;

      if (!topic || !grade || !subject) {
        return res.status(400).json({ message: "Topic, grade, and subject are required" });
      }

      // Generate course content using OpenAI
      const generatedContent = await generateCourseContent(
        topic,
        grade,
        subject,
        duration || "3-months",
        additionalNotes
      );

      // Save generation history if schoolId and userId are provided
      if (schoolId && userId) {
        await storage.createAiCourseGeneration({
          schoolId,
          userId,
          prompt: `${topic} - ${grade} ${subject}`,
          topic,
          grade,
          generatedContent,
          courseId: null,
        });
      }

      res.json(generatedContent);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating course: " + error.message });
    }
  });

  app.get("/api/schools/:schoolId/ai-generations", async (req, res) => {
    try {
      const generations = await storage.getAiCourseGenerationsBySchool(req.params.schoolId);
      res.json(generations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
