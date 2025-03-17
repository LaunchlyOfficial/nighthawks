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
export const insertCrimeReportSchema = createInsertSchema(crimeReports);
export const insertPermissionRequestSchema = createInsertSchema(permissionRequests);
export const insertApplicationSchema = createInsertSchema(applications);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CrimeReport = typeof crimeReports.$inferSelect;
export type InsertCrimeReport = z.infer<typeof insertCrimeReportSchema>;
export type PermissionRequest = typeof permissionRequests.$inferSelect;
export type InsertPermissionRequest = z.infer<typeof insertPermissionRequestSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
