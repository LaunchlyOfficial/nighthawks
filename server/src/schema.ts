import { z } from "zod";

export const insertApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  experience: z.string().min(10, "Please provide more details about your experience"),
  skills: z.array(z.string()).or(z.string()),
  motivation: z.string().min(10, "Please tell us why you want to join"),
  status: z.string().default("pending")
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>; 