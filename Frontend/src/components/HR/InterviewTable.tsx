import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUpcomingInterviewHr } from "@/services/interviewService";
import type { ExtendedScheduledInterview } from "@/utils/types";
import { calculateDuration } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function InterviewTable({
  interviews,
  setInterviews,
}: {
  interviews: ExtendedScheduledInterview[];
  setInterviews: (
    update: (prev: ExtendedScheduledInterview[]) => ExtendedScheduledInterview[]
  ) => void;
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(5);

  useEffect(() => {
    const fetchUpcomingInterviews = async () => {
      await getUpcomingInterviewHr(setLoading, setInterviews);
    };
    fetchUpcomingInterviews();
  }, []);

  const filteredInterviews = interviews
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
    <div className="bg-white shadow-lg  border rounded-lg p-4 flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Scheduled Interviews
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search by name, email, or position"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              ...new Set(interviews.map((interview) => interview.position)),
            ].map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setNumberOfRowsToShow(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="5" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[5, 10, 15, 20, 25, 30].map((pos) => (
              <SelectItem key={pos} value={pos.toString()}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interview List */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2 border">Stage</th>
              <th className="p-2 border">Interviewee</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Interviewer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Resume</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-gray-500 animate-pulse"
                >
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredInterviews.length > 0 ? (
                filteredInterviews
                  .slice(0, numberOfRowsToShow)
                  .map((interview, index) => (
                    <tr key={index} className="text-center border-b">
                      <td className="p-2 border">{interview.stage}</td>
                      <td className="p-2 border">
                        <div className="flex flex-col">
                          <span>{interview.intervieweeName}</span>
                          <span className="text-xs">
                            ({interview.intervieweeEmail})
                          </span>
                        </div>
                      </td>
                      <td className="p-2 border">{interview.position}</td>
                      <td className="p-2 border">
                        <div className="flex flex-col">
                          <span>{interview.interviewerName}</span>
                          <span className="text-xs">
                            ({interview.interviewerEmail})
                          </span>
                        </div>
                      </td>
                      <td className="p-2 border">{interview.date}</td>
                      <td className="p-2 border">
                        {interview.startTime} - {interview.endTime}
                      </td>
                      <td className="p-2 border">
                        {calculateDuration(
                          interview.startTime,
                          interview.endTime
                        )}
                      </td>
                      <td className="p-2 border">
                        {interview.resumeLink ? (
                          <Button
                            variant="ghost"
                            onClick={() =>
                              window.open(interview.resumeLink, "_blank")
                            }
                          >
                            Open Resume
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No interviews scheduled
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {interviews.length > numberOfRowsToShow && (
        <div>
          <Button onClick={() => navigate("upcoming-interviews")}>
            See All
          </Button>
        </div>
      )}
    </div>
  );
}
