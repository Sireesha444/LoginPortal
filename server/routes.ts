import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { connectToMongoDB } from "./mongodb";
import { 
  studentLoginSchema, 
  companyLoginSchema,
  type StudentLoginData,
  type CompanyLoginData 
} from "@shared/models";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectToMongoDB();
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student authentication routes
  app.post('/api/auth/student/login', async (req, res) => {
    try {
      const loginData = studentLoginSchema.parse(req.body);
      const student = await storage.authenticateStudent(loginData);
      
      if (!student) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // In a real implementation, you would set up a session here
      res.json({ 
        message: "Student login successful",
        user: student.user,
        student: student 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      console.error("Student login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Company authentication routes
  app.post('/api/auth/company/login', async (req, res) => {
    try {
      const loginData = companyLoginSchema.parse(req.body);
      const company = await storage.authenticateCompany(loginData);
      
      if (!company) {
        return res.status(401).json({ message: "Invalid credentials or company code" });
      }

      // In a real implementation, you would set up a session here
      res.json({ 
        message: "Company login successful",
        user: company.user,
        company: company 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      console.error("Company login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Student registration (for email/password users)
  app.post('/api/auth/student/register', async (req, res) => {
    try {
      // Implementation for student registration would go here
      res.status(501).json({ message: "Student registration not implemented yet" });
    } catch (error) {
      console.error("Student registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Company registration
  app.post('/api/auth/company/register', async (req, res) => {
    try {
      // Implementation for company registration would go here
      res.status(501).json({ message: "Company registration not implemented yet" });
    } catch (error) {
      console.error("Company registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}