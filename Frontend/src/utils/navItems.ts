import { Calendar, CalendarCheck, History, Home, Inbox } from "lucide-react";

// Menu items.
export const hrNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Upcoming Interviews",
    url: "/upcoming-interviews",
    icon: CalendarCheck,
  },
  {
    title: "Past Interviews",
    url: "/past-interviews",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];

export const interviewerNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Upcoming Interviews",
    url: "/upcoming-interviews",
    icon: CalendarCheck,
  },
  {
    title: "Past Interviews",
    url: "/past-interviews",
    icon: History,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];
