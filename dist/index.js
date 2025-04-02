// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  crimeReports;
  permissionRequests;
  applications;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.crimeReports = /* @__PURE__ */ new Map();
    this.permissionRequests = /* @__PURE__ */ new Map();
    this.applications = /* @__PURE__ */ new Map();
    this.currentId = {
      users: 1,
      crimeReports: 1,
      permissionRequests: 1,
      applications: 1
    };
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId.users++;
    const user = { ...insertUser, id, role: insertUser.role || "defaultRole" };
    this.users.set(id, user);
    return user;
  }
  async getCrimeReports() {
    return Array.from(this.crimeReports.values());
  }
  async createCrimeReport(report) {
    const id = this.currentId.crimeReports++;
    const crimeReport = {
      ...report,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      evidence: report.evidence || null
    };
    this.crimeReports.set(id, crimeReport);
    return crimeReport;
  }
  async getPermissionRequests() {
    return Array.from(this.permissionRequests.values());
  }
  async createPermissionRequest(request) {
    const id = this.currentId.permissionRequests++;
    const permissionRequest = {
      ...request,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.permissionRequests.set(id, permissionRequest);
    return permissionRequest;
  }
  async getApplications() {
    return Array.from(this.applications.values());
  }
  async createApplication(application) {
    const id = this.currentId.applications++;
    const newApplication = {
      ...application,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user")
});
var crimeReports = pgTable("crime_reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  incidentType: text("incident_type").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence"),
  createdAt: timestamp("created_at").defaultNow()
});
var permissionRequests = pgTable("permission_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  contactInfo: text("contact_info").notNull(),
  testingScope: text("testing_scope").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  skills: text("skills").array().notNull(),
  experience: text("experience").notNull(),
  reason: text("reason").notNull(),
  resume: text("resume"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users);
var insertCrimeReportSchema = createInsertSchema(crimeReports);
var insertPermissionRequestSchema = createInsertSchema(permissionRequests);
var insertApplicationSchema = createInsertSchema(applications);

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getCrimeReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crime reports" });
    }
  });
  app2.post("/api/reports", async (req, res) => {
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
  app2.get("/api/permissions", async (_req, res) => {
    try {
      const requests = await storage.getPermissionRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permission requests" });
    }
  });
  app2.post("/api/permissions", async (req, res) => {
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
  app2.get("/api/applications", async (_req, res) => {
    try {
      const applications2 = await storage.getApplications();
      res.json(applications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ["localhost"]
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
