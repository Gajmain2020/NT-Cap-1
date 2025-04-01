export interface IInterview {
  intervieweeName: string;
  intervieweeEmail: string;
  resumeLink: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
}

export type ExtendedScheduledInterview = IScheduleInterview & {
  stage: string;
  id: string;
};

export interface IScheduleInterview {
  intervieweeName: string;
  intervieweeEmail: string;
  resumeLink: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  interviewerName: string;
  interviewerEmail: string;
}

export interface INavItem {
  title: string;
  icon: React.ComponentType;
  url: string;
}
export interface ISidebarNavItem {
  item: INavItem;
  isActive: boolean;
  onClick: () => void;
  path: string;
}

export type ExtendedInterview = IInterview & {
  interviewerName: string;
  interviewerEmail: string;
};

export interface IInterviewee {
  stage: string;
  position: string;
  name: string;
  email: string;
}

interface FeedbackDetail {
  comments: string;
  topics: string[];
  skill: string;
  rating: "VERY_GOOD" | "GOOD" | "AVERAGE" | "BELOW_AVERAGE";
  id: number;
}

export interface IFeedback {
  finalComment: string;
  feedbackId: number;
  finalDecision: string;
  details: FeedbackDetail[];
}

export interface IFeedbackEntry {
  id: number;
  skill: string;
  rating: string;
  topics: string[];
  comments: string;
}

export interface IIntervieweeDetails {
  id: string;
  intervieweeName: string;
  intervieweeEmail: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  meetLink: string;
  stage: string;
  resumeLink: string;
  l1Id?: string;
}

export interface ISkill {
  skill: string;
  rating: string;
  topics: string[];
  comment: string;
}

export interface IPastInterview {
  date: string;
  finalDecision: string;
  interviewId: number;
  position: string;
  intervieweeName: string;
  intervieweeEmail: string;
  interviewerName: string;
  interviewerEmail: string;
  isRescheduled: boolean;
}
