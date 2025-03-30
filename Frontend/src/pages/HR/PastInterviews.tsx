import { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import { FetchPastInterviewsAPI } from "@/api/hrApis";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPastInterview } from "@/utils/types";
import { Delete } from "lucide-react";

export default function PastInterviews() {
  const [pastInterviews, setPastInterviews] = useState<IPastInterview[]>([]);
  const [selectedInterview, setSelectedInterview] =
    useState<IPastInterview | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newInterviewer, setNewInterviewer] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastInterview = async () => {
      try {
        const response = await FetchPastInterviewsAPI();

        setPastInterviews(response.pastInterviews);
      } catch (error) {
        console.log("Error occurred:", error);
        toast.error("Error occurred while fetching past interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchPastInterview();
  }, []);

  const handleReschedule = (
    interview: SetStateAction<IPastInterview | null>
  ) => {
    setSelectedInterview(interview);
    setRescheduleOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Candidate</th>
            <th className="border p-2">Interviewer</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Decision</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {pastInterviews.map((interview) => (
            <tr key={interview.interviewId} className="text-center border">
              <td className="border p-2">
                <div className="flex flex-col">
                  <span>{interview.intervieweeName}</span>
                  <span className="text-xs">{interview.intervieweeEmail}</span>
                </div>
              </td>
              <td className="border p-2">
                <div className="flex flex-col">
                  <span>{interview.interviewerName}</span>
                  <span className="text-xs">{interview.interviewerEmail}</span>
                </div>
              </td>
              <td className="border p-2">{interview.position}</td>
              <td className="border p-2">{interview.date}</td>
              <td className="border p-2 font-medium">
                {interview.finalDecision}
              </td>
              <td className="border p-2 ">
                {interview.finalDecision === "L1_PASSED_WITH_COMMENT" && (
                  <Button onClick={() => handleReschedule(interview)}>
                    Reschedule L2
                  </Button>
                )}
                &nbsp; &nbsp;
                <Button
                  onClick={() =>
                    window.open(
                      `${window.location}/${interview.interviewId}`,
                      "_blank"
                    )
                  }
                >
                  View
                </Button>
              </td>
              <td className="border p-2">
                <div className="flex justify-center cursor-pointer hover:scale-110 transition">
                  <Delete color="red" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reschedule Interview for {selectedInterview?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="New Interviewer"
              value={newInterviewer}
              onChange={(e) => setNewInterviewer(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Button
              onClick={() => {
                console.log("Rescheduled Interview: ", {
                  newInterviewer,
                  newDate,
                });
                setRescheduleOpen(false);
              }}
            >
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
