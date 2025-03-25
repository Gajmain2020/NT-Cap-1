import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { FetchUpcomingInterviewerInterviews } from "@/api/interviewerApis";
import { ExtendedScheduledInterview } from "@/utils/types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function UpcomingInterviews() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState<
    ExtendedScheduledInterview[]
  >([]);

  useEffect(() => {
    const fetchUpcomingInterview = async () => {
      try {
        setLoading(true);

        const response = await FetchUpcomingInterviewerInterviews();

        if (!response.success) {
          toast.error(response.message);
          return;
        }
        setUpcomingInterviews(response.interviews);
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
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {loading ? (
          <p className="animate-pulse">Loading upcoming interviews...</p>
        ) : upcomingInterviews.length === 0 ? (
          <p>No upcoming interviews.</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Candidate
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Position</th>
                  <th className="border border-gray-300 px-4 py-2">Stage</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Time</th>
                  <th className="border border-gray-300 px-4 py-2">Resume</th>
                </tr>
              </thead>
              <tbody>
                {upcomingInterviews.slice(0, 5).map((interview) => (
                  <tr key={interview.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.intervieweeName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.position}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.stage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.startTime} - {interview.endTime}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {interview.resumeLink === "" ? (
                        "N/A"
                      ) : (
                        <Button
                          variant={"ghost"}
                          onClick={() =>
                            window.open(interview.resumeLink, "_blank")
                          }
                        >
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
      <CardFooter>
        {upcomingInterviews.length > 5 && (
          <Button onClick={() => navigate("/all-upcoming-interviews")}>
            Show All
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
