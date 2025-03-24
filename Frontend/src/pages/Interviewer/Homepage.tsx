import OngoingInterview from "@/components/Interviewer/OngoingInterview";
import UpcomingInterviews from "@/components/Interviewer/UpcomingInterviews";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function InterviewerHome() {
  const navigate = useNavigate();

  const pastInterviews = [
    {
      id: 5,
      name: "John Doe",
      position: "Software Engineer",
      status: "L1 Passed with Comments",
    },
    {
      id: 6,
      name: "Jane Doe",
      position: "Full Stack Developer",
      status: "Rejected",
    },
    {
      id: 7,
      name: "Chris Evans",
      position: "AI Engineer",
      status: "L2 Passed",
    },
    {
      id: 8,
      name: "Diana Prince",
      position: "Cybersecurity Analyst",
      status: "Rejected",
    },
  ];

  const maxDisplay = 3;

  return (
    <div className="container mx-auto p-2 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-6">Interviewer Dashboard</h1>

      {/* Ongoing Feedbacks */}
      <OngoingInterview />

      {/* Upcoming Interviews */}
      <UpcomingInterviews />

      {/* Past Interviews */}
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Past Interviews</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {pastInterviews.length === 0 ? (
            <p>No past interviews.</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Candidate
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Position
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pastInterviews.slice(0, maxDisplay).map((interview) => (
                    <tr key={interview.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Button
                          onClick={() => navigate(`/report/${interview.id}`)}
                        >
                          View Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
        <CardFooter>
          {pastInterviews.length > maxDisplay && (
            <Button onClick={() => navigate("/all-past-interviews")}>
              Show All
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
