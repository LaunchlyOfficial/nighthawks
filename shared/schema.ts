import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const crimeReports = pgTable("crime_reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  incidentType: text("incident_type").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"),
});

export const permissionRequests = pgTable("permission_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  contactInfo: text("contact_info").notNull(),
  testingScope: text("testing_scope").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  position: text("position").notNull(),
  experience: text("experience").notNull(),
  skills: text("skills").array(),
  motivation: text("motivation").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertCrimeReportSchema = createInsertSchema(crimeReports);
export const insertPermissionRequestSchema = createInsertSchema(permissionRequests);
export const insertApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  experience: z.string().min(10, "Please provide more details about your experience"),
  skills: z.array(z.string()).or(z.string()),
  motivation: z.string().min(10, "Please tell us why you want to join"),
  status: z.string().default("pending")
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CrimeReport = typeof crimeReports.$inferSelect;
export type InsertCrimeReport = z.infer<typeof insertCrimeReportSchema>;
export type PermissionRequest = typeof permissionRequests.$inferSelect;
export type InsertPermissionRequest = z.infer<typeof insertPermissionRequestSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export const updateReportStatusSchema = z.object({
  status: z.enum(['pending', 'investigating', 'resolved', 'rejected']),
});

export type UpdateReportStatus = z.infer<typeof updateReportStatusSchema>;

export const updatePermissionStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export type UpdatePermissionStatus = z.infer<typeof updatePermissionStatusSchema>;
