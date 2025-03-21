import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function InterviewerHome() {
  const navigate = useNavigate();

  // Dummy Data
  const upcomingInterviews = [
    {
      id: 1,
      name: "Alice Johnson",
      position: "Frontend Developer",
      date: "2025-03-25",
      time: "10:00 AM",
    },
    {
      id: 2,
      name: "Mark Smith",
      position: "Backend Developer",
      date: "2025-03-26",
      time: "2:00 PM",
    },
    {
      id: 3,
      name: "Emily Brown",
      position: "Data Scientist",
      date: "2025-03-27",
      time: "4:00 PM",
    },
    {
      id: 4,
      name: "Robert White",
      position: "DevOps Engineer",
      date: "2025-03-28",
      time: "11:00 AM",
    },
  ];

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

  const pendingFeedbacks = [
    { id: 9, name: "Emily Brown", position: "Data Scientist" },
    { id: 10, name: "Peter Parker", position: "Machine Learning Engineer" },
    { id: 11, name: "Tony Stark", position: "Cloud Engineer" },
    { id: 12, name: "Bruce Wayne", position: "Software Architect" },
  ];

  const maxDisplay = 3;

  return (
    <div className="container mx-auto p-2 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-6">Interviewer Dashboard</h1>

      {/* Pending Feedbacks */}
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Pending Feedbacks</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {pendingFeedbacks.length === 0 ? (
            <p>No pending feedbacks.</p>
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
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingFeedbacks.slice(0, maxDisplay).map((feedback) => (
                    <tr key={feedback.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {feedback.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {feedback.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Button
                          onClick={() => navigate(`/feedback/${feedback.id}`)}
                        >
                          Submit Feedback
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
          {pendingFeedbacks.length > maxDisplay && (
            <Button onClick={() => navigate("/all-feedbacks")}>Show All</Button>
          )}
        </CardFooter>
      </Card>

      {/* Upcoming Interviews */}
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {upcomingInterviews.length === 0 ? (
            <p>No upcoming interviews.</p>
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
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingInterviews.slice(0, maxDisplay).map((interview) => (
                    <tr key={interview.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interview.time}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Button
                          onClick={() => navigate(`/interview/${interview.id}`)}
                        >
                          View
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
          {upcomingInterviews.length > maxDisplay && (
            <Button onClick={() => navigate("/all-upcoming-interviews")}>
              Show All
            </Button>
          )}
        </CardFooter>
      </Card>

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
