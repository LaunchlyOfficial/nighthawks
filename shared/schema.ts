import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
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
});

export const permissionRequests = pgTable("permission_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  contactInfo: text("contact_info").notNull(),
  testingScope: text("testing_scope").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  skills: text("skills").array().notNull(),
  experience: text("experience").notNull(),
  reason: text("reason").notNull(),
  resume: text("resume"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertCrimeReportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  incidentType: z.string().min(1, "Incident type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  evidence: z.string().optional(),
});
export const insertPermissionRequestSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z.string().url("Invalid website URL"),
  contactInfo: z.string().min(1, "Contact information is required"),
  testingScope: z.string().min(10, "Testing scope must be at least 10 characters"),
});
export const insertApplicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().default("Security Analyst"),
  experience: z.string().min(10, "Please provide more details about your experience"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  reason: z.string().min(10, "Please tell us why you want to join"),
  resume: z.string().url().optional(),
  status: z.string().default("New")
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
