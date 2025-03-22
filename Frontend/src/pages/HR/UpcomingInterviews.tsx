import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUpcomingInterviewHr } from "@/services/interviewService";
import { ExtendedInterview } from "@/utils/types";
import { Dialog } from "@radix-ui/react-dialog";
import { FilePen } from "lucide-react";

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState<ExtendedInterview[]>([]);
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10);

  const [selectedInterview, setSelectedInterview] =
    useState<ExtendedInterview | null>(null);

  useEffect(() => {
    const fetchUpcomingInterviews = async () => {
      await getUpcomingInterviewHr(setLoading, setInterviews);
    };
    fetchUpcomingInterviews();
  }, []);

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
    <>
      <div className="flex flex-col items-center bg-gray-100 p-2 min-h-full gap-10">
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-6 w-full">
          <h2 className="text-lg font-semibold text-gray-700">
            Upcoming Interviews
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
                  <th className="p-2 border">Edit</th>
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
                          <td className="p-2 border">
                            <Button
                              onClick={() => setSelectedInterview(interview)}
                              variant="ghost"
                            >
                              <FilePen />
                            </Button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">
                        No upcoming interviews scheduled.
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {selectedInterview && (
        <Dialog
          open={selectedInterview !== null}
          onOpenChange={() => setSelectedInterview(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Scheduled Interview</DialogTitle>
            </DialogHeader>

            {/* MAIN EDIT FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Interviewer Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewer Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter interviewer name"
                  value={selectedInterview.interviewerName}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      interviewerName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewer Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewer Email *
                </label>
                <Input
                  type="email"
                  placeholder="Enter interviewer email"
                  value={selectedInterview.interviewerEmail}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      interviewerEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewee Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewee Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter interviewee name"
                  value={selectedInterview.intervieweeName}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      intervieweeName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewee Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewee Email *
                </label>
                <Input
                  type="email"
                  placeholder="Enter interviewee email"
                  value={selectedInterview.intervieweeEmail}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      intervieweeEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* Resume Link */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Resume Link
                </label>
                <Input
                  type="text"
                  placeholder="Enter resume link"
                  value={selectedInterview.resumeLink}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      resumeLink: e.target.value,
                    })
                  }
                />
              </div>

              {/* Meet Link */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Meet Link
                </label>
                <Input
                  type="text"
                  placeholder="Enter meet link"
                  value={selectedInterview.meetLink}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      meetLink: e.target.value,
                    })
                  }
                />
              </div>

              {/* Position */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Position *
                </label>
                <Input
                  type="text"
                  placeholder="Enter position"
                  value={selectedInterview.position}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      position: e.target.value,
                    })
                  }
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interview Date *
                </label>
                <Input
                  type="date"
                  value={selectedInterview.date}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              {/* Start Time */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={selectedInterview.startTime}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* End Time */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={selectedInterview.endTime}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => setSelectedInterview(null)}
              >
                Cancel
              </Button>
              <Button disabled={loading} onClick={() => console.log("hello")}>
                {loading ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
