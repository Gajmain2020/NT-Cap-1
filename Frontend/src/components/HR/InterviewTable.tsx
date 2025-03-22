import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ExtendedInterview } from "@/utils/types";

export default function InterviewTable({
  interviews,
}: {
  interviews: ExtendedInterview[];
}) {
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const duration = end - start;

    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

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
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Scheduled Interviews
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name, email, or position"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={(value) => setFilterPosition(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Position" />
          </SelectTrigger>
          <SelectContent>
            {[
              ...new Set(interviews.map((interview) => interview.position)),
            ].map((pos) => (
              <SelectItem key={pos} value={pos}>
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
              <th className="p-2 border">Interviewee</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Interviewer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Resume</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview, index) => (
                <tr key={index} className="text-center border-b">
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
                    {calculateDuration(interview.startTime, interview.endTime)}
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
        </table>
      </div>
    </div>
  );
}
