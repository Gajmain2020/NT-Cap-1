import { FetchIntervieweeDetailsAPI } from "@/api/interviewerApis";
import { IIntervieweeDetails } from "@/utils/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CardContent } from "../ui/card";

export default function IntervieweeDetails() {
  const { interviewId } = useParams<string>();

  const [loading, setLoading] = useState(true);
  const [interviewee, setInterviewee] = useState<IIntervieweeDetails>();

  useEffect(() => {
    const fetchIntervieweeDetails = async (interviewId: string | undefined) => {
      try {
        if (!interviewId) {
          toast.error("Invalid interviewee ID.");
          return;
        }

        const response = await FetchIntervieweeDetailsAPI(interviewId);

        if (!response.success) {
          toast.error("Failed to fetch interviewee details.");
          return;
        }

        setInterviewee(response.interviewee);
      } catch (error) {
        console.log("Error occurred: ", error);
        toast.error(
          "Error while fetching interviewee details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIntervieweeDetails(interviewId);
  }, []);

  return (
    <CardContent>
      <div className="border border-gray-300 p-3 rounded-lg shadow-md flex flex-col gap-3 items-center">
        <div className="font-semibold">Interviewee Details</div>

        {/* Details */}
        {loading ? (
          <p className="animate-pulse text-center">
            Loading interviewee details...
          </p>
        ) : interviewee ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full">
            <p>
              <i>Candidate : </i>
              <span className="font-semibold">
                {interviewee.intervieweeName}
                <span className="text-xs text-gray-700">
                  ({interviewee.intervieweeEmail})
                </span>
              </span>
            </p>
            <p>
              <i>Date : </i> {interviewee.date}
            </p>
            <p>
              <i>Time : </i> {interviewee.startTime} - {interviewee.endTime}
            </p>
            <p>
              <i>Stage : </i> {interviewee.stage}
            </p>
          </div>
        ) : (
          "Could not fetch."
        )}
      </div>
    </CardContent>
  );
}
