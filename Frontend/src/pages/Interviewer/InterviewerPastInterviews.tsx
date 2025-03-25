import { FetchInterviewerPastFeedbacksAPI } from "@/api/interviewerApis";
import { Button } from "@/components/ui/button";
import { ExtendedScheduledInterview } from "@/utils/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TPastInterviews = ExtendedScheduledInterview & {
  finalStatus: string;
  feedbackId: string;
};

export default function InterviewerPastInterviews() {
  const [loading, setLoading] = useState(true);
  const [pastInterviews, setPastInterviews] = useState<TPastInterviews[]>([]);

  useEffect(() => {
    const fetchPastInterview = async () => {
      try {
        const response = await FetchInterviewerPastFeedbacksAPI();

        if (!response.success) {
          toast.error(response.message);
          return;
        }
        console.log(response);
        setPastInterviews(response.feedback);
      } catch (error) {
        console.log("Error occurred:", error);
        toast.error("Error occurred while fetching past interview feedbacks. ");
      } finally {
        setLoading(false);
      }
    };

    fetchPastInterview();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl text-center font-semibold mb-4">Past Feedbacks</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">View</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="animate-pulse">
              <td colSpan={6} className="text-center py-2 text-gray-800">
                Fetching past feedbacks...
              </td>
            </tr>
          ) : pastInterviews?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-2 text-gray-800">
                No feedback submitted.
              </td>
            </tr>
          ) : (
            pastInterviews.map((interview) => (
              <tr key={interview.id} className="text-center border">
                <td className="border p-2">
                  {interview.intervieweeName}
                  <p className="text-sm text-gray-700">
                    ( {interview.intervieweeEmail} )
                  </p>
                </td>
                <td className="border p-2">{interview.position}</td>
                <td className="border p-2">{interview.date}</td>
                <td className="border p-2">
                  {interview.startTime} - {interview.endTime}
                </td>
                <td className="border p-2 font-medium">
                  {interview.stage} / {interview.finalStatus}
                </td>
                <td className="border p-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(
                        `${window.location}/feedback/${interview.feedbackId}`,
                        "_blank"
                      )
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
