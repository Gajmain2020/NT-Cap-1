import InterviewTable from "@/components/HR/InterviewTable";
import ScheduleInterview from "@/components/HR/ScheduleInterview";
import { IInterview } from "@/utils/types";
import { interviewSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { toast } from "sonner";

export default function Homepage() {
  const [formData, setFormData] = useState<IInterview>({
    intervieweeName: "",
    intervieweeEmail: "",
    resumeLink: "",
    position: "",
    interviewer: "",
    date: "",
    startTime: "",
    endTime: "",
    meetLink: "",
  });

  const [interviews, setInterviews] = useState<IInterview[]>([]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 min-h-screen gap-10">
      <ScheduleInterview formData={formData} handleChange={handleChange} />

      {/* Interview Table Component */}
      <div className="w-full max-w-4xl">
        <InterviewTable interviews={interviews} />
      </div>
    </div>
  );
}
