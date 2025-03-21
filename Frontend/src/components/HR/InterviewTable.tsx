import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IInterview } from "@/utils/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function InterviewTable({
  interviews,
}: {
  interviews: IInterview[];
}) {
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

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
    .sort(
      (a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
    );

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
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Interviewer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="p-2 border">{interview.intervieweeName}</td>
                  <td className="p-2 border">{interview.intervieweeEmail}</td>
                  <td className="p-2 border">{interview.position}</td>
                  <td className="p-2 border">{interview.interviewer}</td>
                  <td className="p-2 border">
                    {new Date(interview.schedule).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-2 border">
                    {new Date(interview.schedule).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
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
