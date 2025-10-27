import { storage } from "./storage";
import { sql } from "drizzle-orm";
import { db } from "./db";

const DEMO_SCHOOL_ID = "demo-school-id";
const DEMO_ADMIN_ID = "demo-admin-id";

export async function seedDatabase() {
  try {
    console.log("Seeding database with demo data...");

    // Check if demo school already exists
    const existingSchool = await storage.getSchool(DEMO_SCHOOL_ID);
    if (existingSchool) {
      console.log("Demo data already exists, skipping seed");
      return;
    }

    // Create demo school
    const school = await storage.createSchool({
      id: DEMO_SCHOOL_ID,
      name: "Ethiopian Academy",
      email: "admin@ethiopianacademy.edu.et",
      phone: "+251 11 123 4567",
      address: "Addis Ababa, Ethiopia",
      logo: null,
      primaryColor: "#217BF0",
      language: "en",
      timezone: "Africa/Addis_Ababa",
    });

    console.log("Created demo school:", school.name);

    // Create demo admin user
    const admin = await storage.createUser({
      id: DEMO_ADMIN_ID,
      schoolId: DEMO_SCHOOL_ID,
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@ethiopianacademy.edu.et",
      phone: "+251 91 123 4567",
      role: "admin",
      avatar: null,
    });

    console.log("Created demo admin:", admin.username);

    // Create a few demo students
    const student1 = await storage.createStudent({
      schoolId: DEMO_SCHOOL_ID,
      firstName: "Abebe",
      lastName: "Kebede",
      dateOfBirth: new Date("2008-03-15"),
      gender: "male",
      grade: "Grade 10",
      email: "abebe.kebede@student.edu.et",
      phone: "+251 91 234 5678",
      address: "Addis Ababa",
      parentName: "Kebede Abebe",
      parentPhone: "+251 91 345 6789",
      status: "active",
    });

    const student2 = await storage.createStudent({
      schoolId: DEMO_SCHOOL_ID,
      firstName: "Sara",
      lastName: "Ahmed",
      dateOfBirth: new Date("2008-07-22"),
      gender: "female",
      grade: "Grade 10",
      email: "sara.ahmed@student.edu.et",
      phone: "+251 91 456 7890",
      address: "Addis Ababa",
      parentName: "Ahmed Hassan",
      parentPhone: "+251 91 567 8901",
      status: "active",
    });

    console.log("Created demo students");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
