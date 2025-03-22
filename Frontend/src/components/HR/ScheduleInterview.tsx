import { useState } from "react";
import { IInterview } from "@/utils/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  interviewConfirmSchema,
  interviewScheduleSchema,
} from "@/utils/validationSchema";
import { toast } from "sonner";

export default function ScheduleInterview({
  formData,
  handleChange,
}: {
  formData: IInterview;
  handleChange: (e: { target: { name: string; value: string } }) => void;
}) {
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
  const handleConfirmSchedule = () => {
    const isValidInterviewer = interviewConfirmSchema.safeParse(interviewer);

    if (!isValidInterviewer.success) {
      isValidInterviewer.error.issues.forEach((err) =>
        toast.error(err.message)
      );
      return;
    }

    const finalData = {
      ...formData,
      interviewerName: interviewer.interviewerName,
      interviewerEmail: interviewer.interviewerEmail,
    };

    console.log(finalData);
    setDialogOpen(false);
  };

  return (
    <div className="max-w-4xl w-full bg-white shadow-lg h-fit rounded-lg p-6">
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-700">
        Schedule Interview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          name="intervieweeName"
          placeholder="Interviewee Name *"
          value={formData.intervieweeName}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="intervieweeEmail"
          placeholder="Interviewee Email *"
          value={formData.intervieweeEmail}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="position"
          placeholder="Position*"
          value={formData.position}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Input
          type="time"
          name="startTime"
          placeholder="Start Time *"
          value={formData.startTime}
          onChange={handleChange}
        />
        <Input
          type="time"
          name="endTime"
          placeholder="End Time *"
          value={formData.endTime}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="meetLink"
          placeholder="Meet Link (Optional)"
          value={formData.meetLink}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="resumeLink"
          placeholder="Resume Link (Optional)"
          value={formData.resumeLink}
          onChange={handleChange}
        />
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSchedule}>Confirm Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
