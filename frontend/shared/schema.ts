import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "teacher", "parent", "student"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "excused"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"]);

// Schools table (multi-tenant root)
export const schools = pgTable("schools", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").unique(),
  logo: text("logo"),
  primaryColor: text("primary_color").default("#217BF0"),
  secondaryColor: text("secondary_color").default("#F0F4F8"),
  language: text("language").default("en").notNull(), // en, am (Amharic), om (Afaan Oromo)
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("trial"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table (all roles)
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password"), // Nullable for MVP (auth not implemented yet)
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull(),
  avatar: text("avatar"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  teacherId: varchar("teacher_id", { length: 36 }).references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(), // Math, Physics, English, etc.
  grade: text("grade"), // Grade 9, Grade 10, etc.
  thumbnail: text("thumbnail"),
  status: courseStatusEnum("status").default("draft").notNull(),
  syllabus: jsonb("syllabus"), // AI-generated course structure
  totalLessons: integer("total_lessons").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id", { length: 36 }).references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // Rich text content
  orderIndex: integer("order_index").notNull(),
  duration: integer("duration"), // in minutes
  resources: jsonb("resources"), // Links, files, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Students table (simplified standalone for MVP)
export const students = pgTable("students", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  studentId: text("student_id"), // School's internal student ID
  grade: text("grade"),
  section: text("section"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  avatar: text("avatar"),
  parentName: text("parent_name"),
  parentPhone: text("parent_phone"),
  parentEmail: text("parent_email"),
  status: text("status").default("active"), // active, inactive, graduated
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Course enrollments
export const enrollments = pgTable("enrollments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id", { length: 36 }).references(() => courses.id).notNull(),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id).notNull(),
  progress: integer("progress").default(0), // 0-100
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id).notNull(),
  courseId: varchar("course_id", { length: 36 }).references(() => courses.id),
  date: timestamp("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  notes: text("notes"),
  markedBy: varchar("marked_by", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id).notNull(),
  courseId: varchar("course_id", { length: 36 }).references(() => courses.id).notNull(),
  assignmentTitle: text("assignment_title").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  feedback: text("feedback"),
  gradedBy: varchar("graded_by", { length: 36 }).references(() => users.id),
  gradedAt: timestamp("graded_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ETB").notNull(), // Ethiopian Birr
  description: text("description").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Course Generation History
export const aiCourseGenerations = pgTable("ai_course_generations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id", { length: 36 }).references(() => schools.id).notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id).notNull(),
  prompt: text("prompt").notNull(),
  topic: text("topic").notNull(),
  grade: text("grade"),
  generatedContent: jsonb("generated_content").notNull(),
  courseId: varchar("course_id", { length: 36 }).references(() => courses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  courses: many(courses),
  students: many(students),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  coursesTeaching: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  school: one(schools, {
    fields: [courses.schoolId],
    references: [schools.id],
  }),
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
  }),
  lessons: many(lessons),
  enrollments: many(enrollments),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  enrollments: many(enrollments),
  attendance: many(attendance),
  grades: many(grades),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
}));

// Insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  gradedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertAiCourseGenerationSchema = createInsertSchema(aiCourseGenerations).omit({
  id: true,
  createdAt: true,
});

// Types
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type AiCourseGeneration = typeof aiCourseGenerations.$inferSelect;
export type InsertAiCourseGeneration = z.infer<typeof insertAiCourseGenerationSchema>;
