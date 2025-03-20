import CalendarView from "@/components/HR/CalendarView";
import InterviewTable from "@/components/HR/InterviewTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IInterview } from "@/utils/types";
import { interviewSchema } from "@/utils/validationSchema";
import { useState } from "react";
import { toast } from "sonner";

export default function Homepage() {
  const [formData, setFormData] = useState({
    intervieweeName: "",
    intervieweeEmail: "",
    resumeLink: "",
    position: "",
    interviewer: "",
    schedule: "",
  });

  const [interviews, setInterviews] = useState<IInterview[]>([]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleInterview = () => {
    const validation = interviewSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.errors.map((err) => toast.error(err.message));
      return;
    }

    setInterviews((prev) =>
      [...prev, formData].sort(
        (a, b) =>
          new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
      )
    );

    setFormData({
      intervieweeName: "",
      intervieweeEmail: "",
      resumeLink: "",
      position: "",
      interviewer: "",
      schedule: "",
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 min-h-screen gap-10">
      <div className="max-w-4xl w-full bg-white shadow-lg h-fit rounded-lg p-6">
        <h1 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          Schedule Interview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="intervieweeName"
            placeholder="Interviewee Name"
            value={formData.intervieweeName}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="intervieweeEmail"
            placeholder="Interviewee Email"
            value={formData.intervieweeEmail}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="resumeLink"
            placeholder="Resume Link"
            value={formData.resumeLink}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="position"
            placeholder="Position Applied For"
            value={formData.position}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="interviewer"
            placeholder="Interviewer Name"
            value={formData.interviewer}
            onChange={handleChange}
          />
          <Input
            type="datetime-local"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleScheduleInterview}
            className="w-full md:w-auto"
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Interview Table Component */}
      <div className="w-full max-w-4xl">
        <InterviewTable interviews={interviews} />
      </div>

      <div className="w-full max-w-4xl">
        <CalendarView interviews={interviews} />
      </div>
    </div>
  );
}
