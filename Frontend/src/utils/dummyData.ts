export const DummyInterviewSchedule = [
  {
    intervieweeName: "Gajendra Sahu",
    intervieweeEmail: "gajendra@mail.com",
    resumeLink: "123",
    position: "123",
    interviewer: "Jone",
    schedule: "2025-02-26T23:44",
  },
  {
    intervieweeName: "test2",
    intervieweeEmail: "test2@gamil.com",
    resumeLink: "jhsjdh",
    position: "pos",
    interviewer: "testing2",
    schedule: "2025-03-20T23:40",
  },
  {
    intervieweeName: "jshd",
    intervieweeEmail: "jshd@mail.com",
    resumeLink: "hjsdj",
    position: "jshd",
    interviewer: "sjdh",
    schedule: "2025-03-20T23:41",
  },
  {
    intervieweeName: "kkhjsdj",
    intervieweeEmail: "jhsdjsjdh@mail.com",
    resumeLink: "jshdj",
    position: "sjdh@mail.com",
    interviewer: "123",
    schedule: "2025-03-20T23:43",
  },
];

export function generateDummyFeedback() {
  const skills = [
    "Basic Algorithm",
    "Code and Syntax",
    "Design Patterns",
    "SQL",
    "Git",
    "Overall Attitude",
    "Learning Ability",
    "Resume Explanation",
    "Communication",
  ];

  const ratings = ["Average", "Good", "Not Evaluated", "Poor", "Very Good"];

  const topics = {
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

  return skills.map((skill, index) => ({
    srNo: index + 1,
    skill,
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    topicsUsed: topics[skill as keyof typeof topics].join(", "),
    comments: "hello world this is testing phase 1",
  }));
}
