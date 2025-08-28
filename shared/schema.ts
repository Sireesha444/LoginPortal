import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").$type<'student' | 'company'>().notNull().default('student'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company-specific information
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name").notNull(),
  companyCode: varchar("company_code").notNull().unique(),
  companyEmail: varchar("company_email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student-specific information
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  studentEmail: varchar("student_email"),
  password: text("password"), // Optional for Google OAuth users
  university: varchar("university"),
  major: varchar("major"),
  graduationYear: varchar("graduation_year"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for user upsert (Replit Auth)
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  userType: true,
});

// Schema for company registration
export const insertCompanySchema = createInsertSchema(companies).pick({
  companyName: true,
  companyCode: true,
  companyEmail: true,
  password: true,
});

// Schema for student registration
export const insertStudentSchema = createInsertSchema(students).pick({
  studentEmail: true,
  password: true,
  university: true,
  major: true,
  graduationYear: true,
});

// Schema for student login
export const studentLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for company login
export const companyLoginSchema = z.object({
  email: z.string().email("Please enter a valid company email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyCode: z.string().min(1, "Company code is required"),
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type StudentLoginData = z.infer<typeof studentLoginSchema>;
export type CompanyLoginData = z.infer<typeof companyLoginSchema>;
