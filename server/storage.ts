import {
  User,
  Student,
  Company,
  type IUser,
  type IStudent,
  type ICompany,
  type UpsertUser,
  type InsertCompany,
  type InsertStudent,
  type StudentLoginData,
  type CompanyLoginData,
} from "@shared/models";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { isMongoConnected } from "./mongodb";
import { inMemoryStorage } from "./inMemoryStorage";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  getUser(id: string): Promise<IUser | undefined>;
  upsertUser(user: UpsertUser): Promise<IUser>;
  
  // Student operations
  createStudent(userId: string, studentData: InsertStudent): Promise<IStudent>;
  getStudentByEmail(email: string): Promise<(IStudent & { user: IUser }) | undefined>;
  authenticateStudent(loginData: StudentLoginData): Promise<(IStudent & { user: IUser }) | undefined>;
  
  // Company operations
  createCompany(userId: string, companyData: InsertCompany): Promise<ICompany>;
  getCompanyByEmail(email: string): Promise<(ICompany & { user: IUser }) | undefined>;
  authenticateCompany(loginData: CompanyLoginData): Promise<(ICompany & { user: IUser }) | undefined>;
}

export class HybridStorage implements IStorage {
  // Automatically choose between MongoDB and in-memory storage
  private getStorage() {
    return isMongoConnected() ? new MongoStorage() : inMemoryStorage;
  }
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  async getUser(id: string): Promise<IUser | undefined> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.getUser(id);
    }
    return (storage as MongoStorage).getUser(id);
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.upsertUser(userData);
    }
    return (storage as MongoStorage).upsertUser(userData);
  }

  // Student operations
  async createStudent(userId: string, studentData: InsertStudent): Promise<IStudent> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.createStudent(userId, studentData);
    }
    return (storage as MongoStorage).createStudent(userId, studentData);
  }

  async getStudentByEmail(email: string): Promise<(IStudent & { user: IUser }) | undefined> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.getStudentByEmail(email);
    }
    return (storage as MongoStorage).getStudentByEmail(email);
  }

  async authenticateStudent(loginData: StudentLoginData): Promise<(IStudent & { user: IUser }) | undefined> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.authenticateStudent(loginData);
    }
    return (storage as MongoStorage).authenticateStudent(loginData);
  }

  // Company operations
  async createCompany(userId: string, companyData: InsertCompany): Promise<ICompany> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.createCompany(userId, companyData);
    }
    return (storage as MongoStorage).createCompany(userId, companyData);
  }

  async getCompanyByEmail(email: string): Promise<(ICompany & { user: IUser }) | undefined> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.getCompanyByEmail(email);
    }
    return (storage as MongoStorage).getCompanyByEmail(email);
  }

  async authenticateCompany(loginData: CompanyLoginData): Promise<(ICompany & { user: IUser }) | undefined> {
    const storage = this.getStorage();
    if (storage === inMemoryStorage) {
      return storage.authenticateCompany(loginData);
    }
    return (storage as MongoStorage).authenticateCompany(loginData);
  }
}

// Keep the original MongoStorage for when MongoDB is connected
export class MongoStorage implements IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  async getUser(id: string): Promise<IUser | undefined> {
    try {
      const user = await User.findById(id);
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userData._id,
        {
          ...userData,
          updatedAt: new Date(),
        },
        { 
          upsert: true, 
          new: true, 
          runValidators: true 
        }
      );
      return user!;
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  }

  // Student operations
  async createStudent(userId: string, studentData: InsertStudent): Promise<IStudent> {
    try {
      const hashedPassword = studentData.password 
        ? await bcrypt.hash(studentData.password, 10)
        : undefined;

      const student = new Student({
        ...studentData,
        userId: new mongoose.Types.ObjectId(userId),
        password: hashedPassword,
      });

      await student.save();
      return student;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async getStudentByEmail(email: string): Promise<(IStudent & { user: IUser }) | undefined> {
    try {
      const student = await Student.findOne({ studentEmail: email }).populate('userId');
      if (!student) return undefined;

      return {
        ...student.toObject(),
        user: student.userId as IUser,
      };
    } catch (error) {
      console.error("Error getting student by email:", error);
      return undefined;
    }
  }

  async authenticateStudent(loginData: StudentLoginData): Promise<(IStudent & { user: IUser }) | undefined> {
    try {
      const student = await this.getStudentByEmail(loginData.email);
      if (!student || !student.password) return undefined;

      const isValidPassword = await bcrypt.compare(loginData.password, student.password);
      if (!isValidPassword) return undefined;

      return student;
    } catch (error) {
      console.error("Error authenticating student:", error);
      return undefined;
    }
  }

  // Company operations
  async createCompany(userId: string, companyData: InsertCompany): Promise<ICompany> {
    try {
      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      const company = new Company({
        ...companyData,
        userId: new mongoose.Types.ObjectId(userId),
        password: hashedPassword,
      });

      await company.save();
      return company;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }

  async getCompanyByEmail(email: string): Promise<(ICompany & { user: IUser }) | undefined> {
    try {
      const company = await Company.findOne({ companyEmail: email }).populate('userId');
      if (!company) return undefined;

      return {
        ...company.toObject(),
        user: company.userId as IUser,
      };
    } catch (error) {
      console.error("Error getting company by email:", error);
      return undefined;
    }
  }

  async authenticateCompany(loginData: CompanyLoginData): Promise<(ICompany & { user: IUser }) | undefined> {
    try {
      const company = await this.getCompanyByEmail(loginData.email);
      if (!company) return undefined;

      const isValidPassword = await bcrypt.compare(loginData.password, company.password);
      if (!isValidPassword) return undefined;

      // Verify company code
      if (company.companyCode !== loginData.companyCode) return undefined;

      return company;
    } catch (error) {
      console.error("Error authenticating company:", error);
      return undefined;
    }
  }
}

export const storage = new HybridStorage();