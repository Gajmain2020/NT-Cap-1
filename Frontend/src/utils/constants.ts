export const interviewScheduleFields = [
  { type: "text", name: "intervieweeName", placeholder: "Interviewee Name *" },
  {
    type: "email",
    name: "intervieweeEmail",
    placeholder: "Interviewee Email *",
  },
  { type: "text", name: "position", placeholder: "Position *" },
  { type: "date", name: "date" },
  { type: "time", name: "startTime", placeholder: "Start Time *" },
  { type: "time", name: "endTime", placeholder: "End Time *" },
  { type: "text", name: "meetLink", placeholder: "Meet Link (Optional)" },
  { type: "text", name: "resumeLink", placeholder: "Resume Link (Optional)" },
];

export const interviewRescheduleFields = [
  { label: "Interviewer Name *", name: "interviewerName", type: "text" },
  { label: "Interviewer Email *", name: "interviewerEmail", type: "email" },
  { label: "Interviewee Name *", name: "intervieweeName", type: "text" },
  { label: "Interviewee Email *", name: "intervieweeEmail", type: "email" },
  { label: "Resume Link", name: "resumeLink", type: "text" },
  { label: "Meet Link", name: "meetLink", type: "text" },
  { label: "Position *", name: "position", type: "text" },
  { label: "Interview Date *", name: "date", type: "date" },
  { label: "Start Time *", name: "startTime", type: "time" },
  { label: "End Time *", name: "endTime", type: "time" },
];
