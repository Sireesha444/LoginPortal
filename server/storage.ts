import {
  users,
  companies,
  students,
  type User,
  type UpsertUser,
  type Company,
  type Student,
  type InsertCompany,
  type InsertStudent,
  type StudentLoginData,
  type CompanyLoginData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Student operations
  createStudent(userId: string, studentData: InsertStudent): Promise<Student>;
  getStudentByEmail(email: string): Promise<(Student & { user: User }) | undefined>;
  authenticateStudent(loginData: StudentLoginData): Promise<(Student & { user: User }) | undefined>;
  
  // Company operations
  createCompany(userId: string, companyData: InsertCompany): Promise<Company>;
  getCompanyByEmail(email: string): Promise<(Company & { user: User }) | undefined>;
  authenticateCompany(loginData: CompanyLoginData): Promise<(Company & { user: User }) | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Student operations
  async createStudent(userId: string, studentData: InsertStudent): Promise<Student> {
    const hashedPassword = studentData.password 
      ? await bcrypt.hash(studentData.password, 10)
      : null;

    const [student] = await db
      .insert(students)
      .values({
        ...studentData,
        userId,
        password: hashedPassword,
      })
      .returning();
    return student;
  }

  async getStudentByEmail(email: string): Promise<(Student & { user: User }) | undefined> {
    const result = await db
      .select()
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(students.studentEmail, email));

    if (result.length === 0) return undefined;

    return {
      ...result[0].students,
      user: result[0].users,
    };
  }

  async authenticateStudent(loginData: StudentLoginData): Promise<(Student & { user: User }) | undefined> {
    const student = await this.getStudentByEmail(loginData.email);
    if (!student || !student.password) return undefined;

    const isValidPassword = await bcrypt.compare(loginData.password, student.password);
    if (!isValidPassword) return undefined;

    return student;
  }

  // Company operations
  async createCompany(userId: string, companyData: InsertCompany): Promise<Company> {
    const hashedPassword = await bcrypt.hash(companyData.password, 10);

    const [company] = await db
      .insert(companies)
      .values({
        ...companyData,
        userId,
        password: hashedPassword,
      })
      .returning();
    return company;
  }

  async getCompanyByEmail(email: string): Promise<(Company & { user: User }) | undefined> {
    const result = await db
      .select()
      .from(companies)
      .innerJoin(users, eq(companies.userId, users.id))
      .where(eq(companies.companyEmail, email));

    if (result.length === 0) return undefined;

    return {
      ...result[0].companies,
      user: result[0].users,
    };
  }

  async authenticateCompany(loginData: CompanyLoginData): Promise<(Company & { user: User }) | undefined> {
    const company = await this.getCompanyByEmail(loginData.email);
    if (!company) return undefined;

    const isValidPassword = await bcrypt.compare(loginData.password, company.password);
    if (!isValidPassword) return undefined;

    // Verify company code
    if (company.companyCode !== loginData.companyCode) return undefined;

    return company;
  }
}

export const storage = new DatabaseStorage();
