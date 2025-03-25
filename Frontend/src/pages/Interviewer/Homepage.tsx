import OngoingInterview from "@/components/Interviewer/OngoingInterview";
import UpcomingInterviews from "@/components/Interviewer/UpcomingInterviews";

export default function InterviewerHome() {
  return (
    <div className="container mx-auto p-2 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-6">Interviewer Dashboard</h1>

      {/* Ongoing Feedbacks */}
      <OngoingInterview />

      {/* Upcoming Interviews */}
      <UpcomingInterviews />
    </div>
  );
}
