import { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import { FetchPastInterviewsAPI } from "@/api/hrApis";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { IPastInterview } from "@/utils/types";
import { Delete } from "lucide-react";

export default function PastInterviews() {
  const [loading, setLoading] = useState(true);

  // Stores the data coming from the server
  const [pastInterviews, setPastInterviews] = useState<IPastInterview[]>([]);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10);

  //For Rescheduling the interview
  const [selectedInterview, setSelectedInterview] =
    useState<IPastInterview | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  // State to reschedule interviewer details
  const [newInterviewer, setNewInterviewer] = useState("");
  const [newDate, setNewDate] = useState("");

  // Delete interview confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(-1);

  useEffect(() => {
    const fetchPastInterview = async () => {
      try {
        const response = await FetchPastInterviewsAPI();

        setPastInterviews(response.pastInterviews);
      } catch (error) {
        console.log("Error occurred:", error);
        toast.error("Error occurred while fetching past interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchPastInterview();
  }, []);

  const handleReschedule = (
    interview: SetStateAction<IPastInterview | null>
  ) => {
    setSelectedInterview(interview);
    setRescheduleOpen(true);
  };

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
      return 0; // Return 0 if dates are equal
    });

  function handleConfirmDelete() {
    console.log("hello world", deleteId);
    setPastInterviews((inv) =>
      inv.filter((inv) => inv.interviewId !== deleteId)
    );
    return;
  }

  return (
    <div className="flex flex-col items-center p-2 min-h-full gap-10">
      <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col border gap-6 w-full">
        <h2
          className="text-lg font-semibold  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10);
 text-gray-700"
        >
          Past Interviews
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

        {/* Past Interview List */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Candidate</th>
                <th className="border p-2">Interviewer</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Decision</th>
                <th className="border p-2">Actions</th>
                <th className="border p-2">Delete</th>
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
                    .map((interview) => (
                      <tr
                        key={interview.interviewId}
                        className="text-center border"
                      >
                        <td className="border p-2">
                          <div className="flex flex-col">
                            <span>{interview.intervieweeName}</span>
                            <span className="text-xs">
                              {interview.intervieweeEmail}
                            </span>
                          </div>
                        </td>
                        <td className="border p-2">
                          <div className="flex flex-col">
                            <span>{interview.interviewerName}</span>
                            <span className="text-xs">
                              {interview.interviewerEmail}
                            </span>
                          </div>
                        </td>
                        <td className="border p-2">{interview.position}</td>
                        <td className="border p-2">{interview.date}</td>
                        <td className="border p-2 font-medium">
                          {interview.finalDecision}
                        </td>
                        <td className="border p-2 ">
                          {interview.finalDecision ===
                            "L1_PASSED_WITH_COMMENT" && (
                            <Button onClick={() => handleReschedule(interview)}>
                              Reschedule L2
                            </Button>
                          )}
                          &nbsp; &nbsp;
                          <Button
                            onClick={() =>
                              window.open(
                                `${window.location}/${interview.interviewId}`,
                                "_blank"
                              )
                            }
                          >
                            View
                          </Button>
                        </td>
                        <td className="border p-2">
                          <div
                            onClick={() => {
                              setConfirmDeleteOpen(true);
                              setDeleteId(interview.interviewId);
                            }}
                            className="flex justify-center cursor-pointer hover:scale-110 transition"
                          >
                            <Delete color="red" />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No interviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Confirmation to delete interview */}
        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this interview?
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setDeleteId(-1);
                  setConfirmDeleteOpen(false);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleConfirmDelete();
                  setConfirmDeleteOpen(false);
                }}
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reschedule Modal */}
        <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Reschedule Interview for {selectedInterview?.intervieweeEmail}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="New Interviewer"
                value={newInterviewer}
                onChange={(e) => setNewInterviewer(e.target.value)}
              />
              <Input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <Button
                onClick={() => {
                  console.log("Rescheduled Interview: ", {
                    newInterviewer,
                    newDate,
                  });
                  setRescheduleOpen(false);
                }}
              >
                Confirm Reschedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
