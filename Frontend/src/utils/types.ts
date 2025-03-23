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
