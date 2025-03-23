import { ExtendedScheduledInterview } from "@/utils/types";
import { format } from "date-fns";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function InterviewOnDateDialog({
  day,
  interviewsOnDay,
}: {
  day: string | number | Date;
  interviewsOnDay: ExtendedScheduledInterview[];
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Interviews on {format(day, "dd MMM yyyy")}</DialogTitle>
      </DialogHeader>
      <div className="overflow-auto space-y-2  max-h-[60dvh]">
        {interviewsOnDay.length > 0 ? (
          interviewsOnDay.map((interview, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-700">
                Interviewee:{" "}
                <span className="italic">
                  {interview.intervieweeName}{" "}
                  <span className="text-sm">
                    ({interview.intervieweeEmail})
                  </span>
                </span>
              </p>
              <p className="text-sm text-gray-700 font-semibold">
                Interviewer:{" "}
                <span className="italic">
                  {interview.interviewerName}{" "}
                  <span className="text-sm">
                    ({interview.interviewerEmail})
                  </span>
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Position/Stage: {interview.position} / {interview.stage}
              </p>
              <p className="text-sm text-gray-600">
                Schedule: {interview.startTime} - {interview.endTime}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No interviews scheduled.
          </p>
        )}
      </div>
    </DialogContent>
  );
}
