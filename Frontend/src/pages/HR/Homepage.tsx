import InterviewTable from "@/components/HR/InterviewTable";
import ScheduleInterview from "@/components/HR/ScheduleInterview";
import { ExtendedInterview, IInterview } from "@/utils/types";
import { useState } from "react";

export default function Homepage() {
  const [formData, setFormData] = useState<IInterview>({
    intervieweeName: "",
    intervieweeEmail: "",
    resumeLink: "",
    position: "",
    date: "",
    startTime: "",
    endTime: "",
    meetLink: "",
  });

  const [interviews, setInterviews] = useState<ExtendedInterview[]>([]);

  // {
  //     "intervieweeName": "testing",
  //     "intervieweeEmail": "testing@mail.com",
  //     "resumeLink": "",
  //     "position": "sde",
  //     "date": "2025-03-23",
  //     "startTime": "17:15",
  //     "endTime": "18:30",
  //     "meetLink": "",
  //     "interviewerName": "Gajju",
  //     "interviewerEmail": "test@mail.com"
  // }

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      interviewerName: "Default Name", // Provide default values
      interviewerEmail: "default@mail.com",
    }));
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 min-h-screen gap-10">
      <ScheduleInterview
        setFormData={setFormData}
        formData={formData}
        handleChange={handleChange}
        setInterviews={setInterviews}
      />

      {/* Interview Table Component */}
      <div className="w-full max-w-6xl">
        <InterviewTable setInterviews={setInterviews} interviews={interviews} />
      </div>
    </div>
  );
}
