import { FetchOngoingInterviewerInterviews } from "@/api/interviewerApis";
import { ExtendedScheduledInterview } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function OngoingInterview() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ongoingInterviews, setOngoingInterviews] = useState<
    ExtendedScheduledInterview[]
  >([]);

  useEffect(() => {
    const fetchUpcomingInterview = async () => {
      try {
        setLoading(true);

        const response = await FetchOngoingInterviewerInterviews();

        if (!response.success) {
          toast.error(response.message);
          return;
        }
        setOngoingInterviews(response.interviews);
      } catch (error) {
        console.log("Error occurred", error);
        toast.error("Error occurred while fetching upcoming interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingInterview();
  }, []);

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle>Ongoing Interviews</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {loading ? (
          <p className="animate-pulse">Fetching ongoing Interview...</p>
        ) : ongoingInterviews.length === 0 ? (
          <p>No ongoing interview for feedbacks.</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Candidate
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Position</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ongoingInterviews.map((feedback) => (
                  <tr key={feedback.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {feedback.intervieweeName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {feedback.position}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button
                        onClick={() => navigate(`/feedback/${feedback.id}`)}
                      >
                        Submit Feedback
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
