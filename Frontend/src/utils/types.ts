export interface IInterview {
  intervieweeName: string;
  intervieweeEmail: string;
  resumeLink: string;
  position: string;
  interviewer: string;
  schedule: string;
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
