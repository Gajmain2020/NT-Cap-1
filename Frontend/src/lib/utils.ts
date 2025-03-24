import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const topicOptions = {
  "Basic Algorithm": ["Search Algorithms", "Sorting", "Recursion"],
  "Code and Syntax": ["Code Optimization", "Algorithm Implementation"],
  "Design Patterns": ["Singleton", "Factory", "Observer"],
  SQL: ["Joins", "Subqueries", "Indexing", "Normalization"],
  Git: ["Git Commands", "Branching", "Merging"],
  "Overall Attitude": ["Attitude during interview"],
  "Learning Ability": ["Learning New Concepts"],
  "Resume Explanation": ["Relevant Experience", "Projects"],
  Communication: ["Clarity of Thoughts", "Communication Skills"],
};

export const fixedForm = [
  { id: 1, skill: "Basic Algorithm", rating: "", topics: [], comments: "" },
  { id: 2, skill: "Code and Syntax", rating: "", topics: [], comments: "" },
  { id: 3, skill: "Design Patterns", rating: "", topics: [], comments: "" },
  { id: 4, skill: "SQL", rating: "", topics: [], comments: "" },
  { id: 5, skill: "Git", rating: "", topics: [], comments: "" },
  { id: 6, skill: "Overall Attitude", rating: "", topics: [], comments: "" },
  { id: 7, skill: "Learning Ability", rating: "", topics: [], comments: "" },
  {
    id: 8,
    skill: "Resume Explanation",
    rating: "",
    topics: [],
    comments: "",
  },
  { id: 9, skill: "Communication", rating: "", topics: [], comments: "" },
];

export const ratingOptions = [
  "Average",
  "Good",
  "Not Evaluated",
  "Poor",
  "Very Good",
];
