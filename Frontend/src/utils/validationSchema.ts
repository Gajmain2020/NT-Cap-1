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
  role: z.enum(["HR", "INTERVIEWER"], {
    errorMap: () => ({ message: "Role must be either HR or Interviewer" }),
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters"),
});

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be 6 characters long."),
  newPassword: z.string().min(6, "New password must be 6 characters long."),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be 6 characters long."),
});

const today = new Date();
today.setHours(0, 0, 0, 0); // Reset time to start of the day

export const interviewScheduleSchema = z.object({
  intervieweeName: z.string().min(1, "Please provide interviewee name."),
  intervieweeEmail: z.string().email("Please provide a valid email."),
  resumeLink: z.string().optional(),
  position: z.string().min(1, "Please provide the position applied for."),
  date: z.string().refine((date) => new Date(date) >= today, {
    message: "Interview date cannot be in the past.",
  }),
  startTime: z.string().min(1, "Please provide start time."),
  endTime: z.string().min(1, "Please provide end time."),
  meetLink: z.string().optional(),
});

export const interviewConfirmSchema = z.object({
  interviewerEmail: z.string().email("Invalid email."),
  interviewerName: z.string().min(1, "Please provide interviewer name."),
});
