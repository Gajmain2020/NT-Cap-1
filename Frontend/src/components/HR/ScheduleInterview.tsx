import { useState } from "react";
import { toast } from "sonner";

import { scheduleInterview } from "@/services/interviewService";
import { interviewScheduleFields } from "@/utils/constants";
import { ExtendedScheduledInterview, IInterview } from "@/utils/types";
import { interviewScheduleSchema } from "@/utils/validationSchema";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function ScheduleInterview({
  formData,
  setFormData,
  handleChange,
  setInterviews,
}: {
  formData: IInterview;
  setFormData: (data: IInterview) => void;
  setInterviews: React.Dispatch<
    React.SetStateAction<ExtendedScheduledInterview[]>
  >;
  handleChange: (e: { target: { name: string; value: string } }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [interviewer, setInterviewer] = useState({
    interviewerName: "",
    interviewerEmail: "",
  });

  // only to handle the data of schedule
  const handleScheduleInterview = () => {
    const isSchemaValid = interviewScheduleSchema.safeParse(formData);

    if (!isSchemaValid.success) {
      isSchemaValid.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    setDialogOpen(true);
  };

  // to handle main thing of adding the data into the database
  const handleConfirmSchedule = async () => {
    await scheduleInterview(
      formData,
      interviewer,
      setLoading,
      setInterviews,
      setFormData,
      setInterviewer,
      setDialogOpen
    );
  };

  return (
    <div className="max-w-6xl w-full border bg-white shadow-lg h-fit rounded-lg p-6">
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-700">
        Schedule Interview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviewScheduleFields.map(({ type, name, placeholder }) => (
          <Input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name as keyof IInterview] || ""}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleScheduleInterview} className="w-full md:w-auto">
          Schedule Interview
        </Button>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Interview Schedule</DialogTitle>
          </DialogHeader>

          <div>
            <p>
              <strong>Interviewee:</strong> {formData.intervieweeName} (
              {formData.intervieweeEmail})
            </p>
            <p>
              <strong>Date:</strong> {formData.date}
            </p>
            <p>
              <strong>Time:</strong> {formData.startTime} - {formData.endTime}
            </p>
            {formData.meetLink && (
              <p>
                <strong>Meet Link:</strong> {formData.meetLink}
              </p>
            )}
            {formData.resumeLink && (
              <p>
                <strong>Resume Link:</strong> {formData.resumeLink}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Input
              type="text"
              placeholder="Interviewer Name *"
              value={interviewer.interviewerName}
              onChange={(e) =>
                setInterviewer({
                  ...interviewer,
                  interviewerName: e.target.value,
                })
              }
            />
            <Input
              type="email"
              placeholder="Interviewer Email *"
              value={interviewer.interviewerEmail}
              onChange={(e) =>
                setInterviewer({
                  ...interviewer,
                  interviewerEmail: e.target.value,
                })
              }
            />
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleConfirmSchedule}>
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
