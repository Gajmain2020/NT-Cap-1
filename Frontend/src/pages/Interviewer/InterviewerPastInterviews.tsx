import { Button } from "@/components/ui/button";
import { ExtendedScheduledInterview } from "@/utils/types";
import { useState } from "react";

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

export default function InterviewerPastInterviews() {
  const [loading, setLoading] = useState(true);
  const [pastInterviews, setPastInterviews] =
    useState<ExtendedScheduledInterview[]>();

  return (
    <div className="p-6">
      <h2 className="text-xl text-center font-semibold mb-4">Past Feedbacks</h2>
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
          {dummyInterviews.map((interview) => (
            <tr key={interview.id} className="text-center border">
              <td className="border p-2">
                {interview.name}
                <p className="text-sm text-gray-700">( {interview.email} )</p>
              </td>
              <td className="border p-2">{interview.position}</td>
              <td className="border p-2">{interview.date}</td>
              <td className="border p-2">{interview.time}</td>
              <td className="border p-2 font-medium">{interview.status}</td>
              <td className="border p-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    window.open(
                      `${window.location}/feedback/${interview.id}`,
                      "_blank"
                    )
                  }
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
