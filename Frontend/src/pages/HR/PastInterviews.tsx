import { SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const dummyInterviews = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Software Engineer",
    date: "2024-03-01",
    time: "10:00 AM",
    status: "L1 Passed with Comments",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "Backend Developer",
    date: "2024-03-02",
    time: "2:00 PM",
    status: "L1 Passed",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "PHP Developer",
    date: "2024-03-03",
    time: "2:00 PM",
    status: "Rejected",
  },
];

export default function PastInterviews() {
  const [selectedInterview, setSelectedInterview] = useState<{
    id: number;
    name: string;
    email: string;
    position: string;
    date: string;
    time: string;
    status: string;
  } | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newInterviewer, setNewInterviewer] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleReschedule = (
    interview: SetStateAction<{
      id: number;
      name: string;
      email: string;
      position: string;
      date: string;
      time: string;
      status: string;
    } | null>
  ) => {
    setSelectedInterview(interview);
    setRescheduleOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyInterviews.map((interview) => (
            <tr key={interview.id} className="text-center border">
              <td
                className="border p-2 cursor-pointer text-blue-600 hover:underline"
                onClick={() =>
                  window.open(`${window.location}/${interview.id}`, "_blank")
                }
              >
                {interview.name}
              </td>
              <td className="border p-2">{interview.email}</td>
              <td className="border p-2">{interview.position}</td>
              <td className="border p-2">{interview.date}</td>
              <td className="border p-2">{interview.time}</td>
              <td className="border p-2 font-medium">{interview.status}</td>
              <td className="border p-2">
                {interview.status === "L1 Passed with Comments" && (
                  <Button onClick={() => handleReschedule(interview)}>
                    Reschedule L2
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reschedule Interview for {selectedInterview?.name}
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
  );
}
