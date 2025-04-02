import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCrimeReportSchema,
  insertPermissionRequestSchema,
  insertApplicationSchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Crime Reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getCrimeReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crime reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const data = insertCrimeReportSchema.parse(req.body);
      const report = await storage.createCrimeReport(data);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create crime report" });
      }
    }
  });

  // Permission Requests
  app.get("/api/permissions", async (_req, res) => {
    try {
      const requests = await storage.getPermissionRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permission requests" });
    }
  });

  app.post("/api/permissions", async (req, res) => {
    try {
      const data = insertPermissionRequestSchema.parse(req.body);
      const request = await storage.createPermissionRequest(data);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create permission request" });
      }
    }
  });

  // Applications
  app.get("/api/applications", async (_req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const data = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(data);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid application data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
