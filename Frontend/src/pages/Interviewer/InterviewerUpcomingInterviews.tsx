import { FetchUpcomingInterviewerInterviews } from "@/api/interviewerApis";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InterviewerUpcomingInterviews() {
  const [loading, setLoading] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState<
    ExtendedScheduledInterview[]
  >([]);

  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10);

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

  const filteredInterviews = upcomingInterviews
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

  return (
    <Card className="flex flex-col gap-6 container mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Upcoming Interviews
        </CardTitle>
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
                  upcomingInterviews.map((interview) => interview.position)
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
                {filteredInterviews
                  .slice(0, numberOfRowsToShow)
                  .map((interview) => (
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
    </Card>
  );
}
