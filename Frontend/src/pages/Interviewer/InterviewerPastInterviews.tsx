import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FetchInterviewerPastFeedbacksAPI } from "@/api/interviewerApis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedScheduledInterview } from "@/utils/types";

type TPastInterviews = ExtendedScheduledInterview & {
  finalStatus: string;
  feedbackId: string;
};

export default function InterviewerPastInterviews() {
  const [loading, setLoading] = useState(true);
  const [pastInterviews, setPastInterviews] = useState<TPastInterviews[]>([]);

  // FOR SEARCH AND FILTER
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10);

  const filteredInterviews = pastInterviews
    .filter(
      (interview) =>
        interview.intervieweeName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        interview.intervieweeEmail
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        interview.position.toLowerCase().includes(search.toLowerCase())
    )
    .filter((interview) =>
      filterPosition ? interview.position === filterPosition : true
    )
    .sort((a, b) => {
      // Sort by date first, then by start time
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

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
    <Card className="flex flex-col gap-6 container mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">Past Interviews</CardTitle>
      </CardHeader>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 px-6">
        <Input
          type="text"
          placeholder="Search by name, email, or position"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Select
            onValueChange={(value) =>
              setFilterPosition(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {[
                ...new Set(
                  pastInterviews.map((interview) => interview.position)
                ),
              ].map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setNumberOfRowsToShow(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {[10, 20, 30, 50, 75, 100].map((pos) => (
                <SelectItem key={pos} value={pos.toString()}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="overflow-auto">
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
            ) : filteredInterviews?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-2 text-gray-800">
                  No feedback submitted.
                </td>
              </tr>
            ) : (
              filteredInterviews
                .slice(0, numberOfRowsToShow)
                .map((interview) => (
                  <tr key={interview.id} className="text-center border">
                    <td className="border p-2">
                      {interview.intervieweeName}
                      <p className="text-sm text-gray-700">
                        {interview.intervieweeEmail}
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
      </CardContent>
    </Card>
  );
}
