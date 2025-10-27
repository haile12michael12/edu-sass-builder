// Reference: javascript_database blueprint
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  schools, users, courses, lessons, students, enrollments,
  attendance, grades, payments, aiCourseGenerations,
  type School, type InsertSchool,
  type User, type InsertUser,
  type Course, type InsertCourse,
  type Lesson, type InsertLesson,
  type Student, type InsertStudent,
  type Enrollment, type InsertEnrollment,
  type Attendance, type InsertAttendance,
  type Grade, type InsertGrade,
  type Payment, type InsertPayment,
  type AiCourseGeneration, type InsertAiCourseGeneration,
} from "@shared/schema";

export interface IStorage {
  // Schools
  getSchool(id: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: string, school: Partial<InsertSchool>): Promise<School | undefined>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsersBySchool(schoolId: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Courses
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesBySchool(schoolId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  // Lessons
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<void>;

  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentsBySchool(schoolId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;

  // Enrollments
  getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]>;
  getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;

  // Attendance
  getAttendanceByStudent(studentId: string): Promise<Attendance[]>;
  getAttendanceBySchoolAndDate(schoolId: string, date: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;

  // Grades
  getGradesByStudent(studentId: string): Promise<Grade[]>;
  getGradesByCourse(courseId: string): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade | undefined>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsBySchool(schoolId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;

  // AI Course Generations
  getAiCourseGeneration(id: string): Promise<AiCourseGeneration | undefined>;
  getAiCourseGenerationsBySchool(schoolId: string): Promise<AiCourseGeneration[]>;
  createAiCourseGeneration(generation: InsertAiCourseGeneration): Promise<AiCourseGeneration>;
}

export class DatabaseStorage implements IStorage {
  // Schools
  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school || undefined;
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const [school] = await db.insert(schools).values(insertSchool).returning();
    return school;
  }

  async updateSchool(id: string, updateData: Partial<InsertSchool>): Promise<School | undefined> {
    const [school] = await db.update(schools).set(updateData).where(eq(schools.id, id)).returning();
    return school || undefined;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUsersBySchool(schoolId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.schoolId, schoolId));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Courses
  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.schoolId, schoolId)).orderBy(desc(courses.createdAt));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async updateCourse(id: string, updateData: Partial<InsertCourse>): Promise<Course | undefined> {
    const [course] = await db.update(courses).set(updateData).where(eq(courses.id, id)).returning();
    return course || undefined;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Lessons
  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.orderIndex);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(insertLesson).returning();
    return lesson;
  }

  async updateLesson(id: string, updateData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const [lesson] = await db.update(lessons).set(updateData).where(eq(lessons.id, id)).returning();
    return lesson || undefined;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentsBySchool(schoolId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.schoolId, schoolId));
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async updateStudent(id: string, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db.update(students).set(updateData).where(eq(students.id, id)).returning();
    return student || undefined;
  }

  // Enrollments
  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(insertEnrollment).returning();
    return enrollment;
  }

  async updateEnrollment(id: string, updateData: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db.update(enrollments).set(updateData).where(eq(enrollments.id, id)).returning();
    return enrollment || undefined;
  }

  // Attendance
  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.studentId, studentId)).orderBy(desc(attendance.date));
  }

  async getAttendanceBySchoolAndDate(schoolId: string, date: Date): Promise<Attendance[]> {
    return await db.select().from(attendance).where(
      and(
        eq(attendance.schoolId, schoolId),
        eq(attendance.date, date)
      )
    );
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(insertAttendance).returning();
    return record;
  }

  // Grades
  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.studentId, studentId)).orderBy(desc(grades.gradedAt));
  }

  async getGradesByCourse(courseId: string): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.courseId, courseId)).orderBy(desc(grades.gradedAt));
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(insertGrade).returning();
    return grade;
  }

  async updateGrade(id: string, updateData: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [grade] = await db.update(grades).set(updateData).where(eq(grades.id, id)).returning();
    return grade || undefined;
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentsBySchool(schoolId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.schoolId, schoolId)).orderBy(desc(payments.createdAt));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: string, updateData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(updateData).where(eq(payments.id, id)).returning();
    return payment || undefined;
  }

  // AI Course Generations
  async getAiCourseGeneration(id: string): Promise<AiCourseGeneration | undefined> {
    const [generation] = await db.select().from(aiCourseGenerations).where(eq(aiCourseGenerations.id, id));
    return generation || undefined;
  }

  async getAiCourseGenerationsBySchool(schoolId: string): Promise<AiCourseGeneration[]> {
    return await db.select().from(aiCourseGenerations).where(eq(aiCourseGenerations.schoolId, schoolId)).orderBy(desc(aiCourseGenerations.createdAt));
  }

  async createAiCourseGeneration(insertGeneration: InsertAiCourseGeneration): Promise<AiCourseGeneration> {
    const [generation] = await db.insert(aiCourseGenerations).values(insertGeneration).returning();
    return generation;
  }
}

export const storage = new DatabaseStorage();
