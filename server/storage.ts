import {
  type User,
  type InsertUser,
  type CrimeReport,
  type InsertCrimeReport,
  type PermissionRequest,
  type InsertPermissionRequest,
  type Application,
  type InsertApplication,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Crime Reports
  getCrimeReports(): Promise<CrimeReport[]>;
  createCrimeReport(report: InsertCrimeReport): Promise<CrimeReport>;
  
  // Permission Requests
  getPermissionRequests(): Promise<PermissionRequest[]>;
  createPermissionRequest(request: InsertPermissionRequest): Promise<PermissionRequest>;
  
  // Applications
  getApplications(): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private crimeReports: Map<number, CrimeReport>;
  private permissionRequests: Map<number, PermissionRequest>;
  private applications: Map<number, Application>;
  private currentId: Record<string, number>;

  constructor() {
    this.users = new Map();
    this.crimeReports = new Map();
    this.permissionRequests = new Map();
    this.applications = new Map();
    this.currentId = {
      users: 1,
      crimeReports: 1,
      permissionRequests: 1,
      applications: 1,
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, role: insertUser.role || "defaultRole" };
    this.users.set(id, user);
    return user;
  }

  async getCrimeReports(): Promise<CrimeReport[]> {
    return Array.from(this.crimeReports.values());
  }

  async createCrimeReport(report: InsertCrimeReport): Promise<CrimeReport> {
    const id = this.currentId.crimeReports++;
    const crimeReport: CrimeReport = {
      ...report,
      id,
      createdAt: new Date(),
      evidence: report.evidence || null,
    };
    this.crimeReports.set(id, crimeReport);
    return crimeReport;
  }

  async getPermissionRequests(): Promise<PermissionRequest[]> {
    return Array.from(this.permissionRequests.values());
  }

  async createPermissionRequest(request: InsertPermissionRequest): Promise<PermissionRequest> {
    const id = this.currentId.permissionRequests++;
    const permissionRequest: PermissionRequest = {
      ...request,
      id,
      createdAt: new Date(),
    };
    this.permissionRequests.set(id, permissionRequest);
    return permissionRequest;
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.currentId.applications++;
    const newApplication: Application = {
      ...application,
      id,
      createdAt: new Date(),
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }
}

export const storage = new MemStorage();
