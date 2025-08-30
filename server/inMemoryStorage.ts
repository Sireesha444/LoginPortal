import bcrypt from "bcrypt";
import {
  type IUser,
  type IStudent, 
  type ICompany,
  type UpsertUser,
  type InsertCompany,
  type InsertStudent,
  type StudentLoginData,
  type CompanyLoginData,
} from "@shared/models";

// In-memory storage as fallback
class InMemoryStorage {
  private users: Map<string, IUser> = new Map();
  private students: Map<string, IStudent> = new Map();
  private companies: Map<string, ICompany> = new Map();
  private nextId = 1;

  private generateId(): string {
    return (this.nextId++).toString();
  }

  // User operations
  async getUser(id: string): Promise<IUser | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    const id = userData._id || this.generateId();
    const existingUser = this.users.get(id);
    
    const user: IUser = {
      _id: id,
      email: userData.email || existingUser?.email,
      firstName: userData.firstName || existingUser?.firstName,
      lastName: userData.lastName || existingUser?.lastName,
      profileImageUrl: userData.profileImageUrl || existingUser?.profileImageUrl,
      userType: userData.userType || existingUser?.userType || 'student',
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    } as IUser;

    this.users.set(id, user);
    return user;
  }

  // Student operations
  async createStudent(userId: string, studentData: InsertStudent): Promise<IStudent> {
    const id = this.generateId();
    const hashedPassword = studentData.password 
      ? await bcrypt.hash(studentData.password, 10)
      : undefined;

    const student: IStudent = {
      _id: id,
      userId: userId as any,
      studentEmail: studentData.studentEmail,
      password: hashedPassword,
      university: studentData.university,
      major: studentData.major,
      graduationYear: studentData.graduationYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IStudent;

    this.students.set(id, student);
    return student;
  }

  async getStudentByEmail(email: string): Promise<(IStudent & { user: IUser }) | undefined> {
    for (const student of this.students.values()) {
      if (student.studentEmail === email) {
        const user = this.users.get(student.userId.toString());
        if (user) {
          return { ...student, user };
        }
      }
    }
    return undefined;
  }

  async authenticateStudent(loginData: StudentLoginData): Promise<(IStudent & { user: IUser }) | undefined> {
    const student = await this.getStudentByEmail(loginData.email);
    if (!student || !student.password) return undefined;

    const isValidPassword = await bcrypt.compare(loginData.password, student.password);
    if (!isValidPassword) return undefined;

    return student;
  }

  // Company operations
  async createCompany(userId: string, companyData: InsertCompany): Promise<ICompany> {
    const id = this.generateId();
    const hashedPassword = await bcrypt.hash(companyData.password, 10);

    const company: ICompany = {
      _id: id,
      userId: userId as any,
      companyName: companyData.companyName,
      companyCode: companyData.companyCode,
      companyEmail: companyData.companyEmail,
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ICompany;

    this.companies.set(id, company);
    return company;
  }

  async getCompanyByEmail(email: string): Promise<(ICompany & { user: IUser }) | undefined> {
    for (const company of this.companies.values()) {
      if (company.companyEmail === email) {
        const user = this.users.get(company.userId.toString());
        if (user) {
          return { ...company, user };
        }
      }
    }
    return undefined;
  }

  async authenticateCompany(loginData: CompanyLoginData): Promise<(ICompany & { user: IUser }) | undefined> {
    const company = await this.getCompanyByEmail(loginData.email);
    if (!company) return undefined;

    const isValidPassword = await bcrypt.compare(loginData.password, company.password);
    if (!isValidPassword) return undefined;

    // Verify company code
    if (company.companyCode !== loginData.companyCode) return undefined;

    return company;
  }
}

export const inMemoryStorage = new InMemoryStorage();