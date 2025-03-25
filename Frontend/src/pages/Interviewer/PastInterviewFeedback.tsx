import { FetchFeedbackDetailsAPI } from "@/api/interviewerApis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDummyFeedback } from "@/utils/dummyData";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function PastInterviewFeedback() {
  const { feedbackId } = useParams<string>();
  // Dummy Candidate Data
  const candidate = {
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Software Engineer",
    status: "L1 Passed with Comments",
  };

  // Generate dummy feedback
  const feedback = generateDummyFeedback();

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response =
          feedbackId && (await FetchFeedbackDetailsAPI(feedbackId));
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        console.log(response);
      } catch (error) {
        console.log("Error", error);
        toast.error(
          "Error occurred while fetching the feedback. Please try again."
        );
      }
    };
    fetchFeedbackDetails();
  }, []);

  return (
    <div className="container mx-auto p-2 flex flex-col gap-8">
      {/* Candidate Info */}
      <Card className="">
        <CardHeader>
          <CardTitle>Interview Report</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around flex-col lg:flex-row">
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Position:</strong> {candidate.position}
          </p>
          <p>
            <strong>Status:</strong> {candidate.status}
          </p>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Sr No.</th>
                <th className="border border-gray-300 px-4 py-2">Skill</th>
                <th className="border border-gray-300 px-4 py-2">Rating</th>
                <th className="border border-gray-300 px-4 py-2">
                  Topics Evaluated
                </th>
                <th className="border border-gray-300 px-4 py-2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.srNo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.skill}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.rating}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.topicsUsed}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
