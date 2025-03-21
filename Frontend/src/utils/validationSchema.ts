import { z } from "zod";

//login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define Zod Schema
export const interviewSchema = z.object({
  intervieweeName: z.string().min(2, "Name must be at least 2 characters"),
  intervieweeEmail: z.string().email("Invalid email address"),
  resumeLink: z.string().optional(),
  position: z.string().min(2, "Position must be at least 2 characters"),
  interviewer: z
    .string()
    .min(2, "Interviewer name must be at least 2 characters"),
  schedule: z.string().min(1, "Date and time are required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["hr", "interviewer"], {
    errorMap: () => ({ message: "Role must be either HR or Interviewer" }),
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters"),
});
