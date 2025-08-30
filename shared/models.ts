import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// User interface and schema
export interface IUser extends Document {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  userType: 'student' | 'company';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  userType: { type: String, enum: ['student', 'company'], default: 'student' },
}, {
  timestamps: true,
});

// Student interface and schema
export interface IStudent extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  studentEmail?: string;
  password?: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentEmail: { type: String, unique: true, sparse: true },
  password: String,
  university: String,
  major: String,
  graduationYear: String,
}, {
  timestamps: true,
});

// Company interface and schema
export interface ICompany extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  companyCode: string;
  companyEmail: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyCode: { type: String, required: true, unique: true },
  companyEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Mongoose models
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

// Zod validation schemas
export const upsertUserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  userType: z.enum(['student', 'company']).optional(),
});

export const insertCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyCode: z.string().min(1, "Company code is required"),
  companyEmail: z.string().email("Please enter a valid company email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertStudentSchema = z.object({
  studentEmail: z.string().email("Please enter a valid email").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  university: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
});

export const studentLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const companyLoginSchema = z.object({
  email: z.string().email("Please enter a valid company email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyCode: z.string().min(1, "Company code is required"),
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type StudentLoginData = z.infer<typeof studentLoginSchema>;
export type CompanyLoginData = z.infer<typeof companyLoginSchema>;