import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { GetFeedbackDetailsAPI } from "@/api/hrApis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "../Loading";
import NotFound from "../NotFound";

interface IInterviewReport {
  intervieweeName: string;
  intervieweeEmail: string;
  position: string;
  interviewerName: string;
  interviewerEmail: string;
  stage: string;
}

export interface FeedbackDetail {
  topicsUsed: string;
  comments: string;
  skill: string;
  rating: "VERY_GOOD" | "GOOD" | "AVERAGE" | "BELOW_AVERAGE" | "POOR"; // Adjust based on possible values
}

export interface IInterviewFeedback {
  feedback: FeedbackDetail[];
  finalComment: string;
  finalDecision: string; // You can use an enum if values are fixed
}

export default function Report() {
  const { interviewId } = useParams<string>();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<IInterviewReport>();
  const [feedback, setFeedback] = useState<IInterviewFeedback>();

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response =
          interviewId && (await GetFeedbackDetailsAPI(interviewId));
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        console.log(response);
        setInterview(response.interview);
        setFeedback(response.feedbackDetails);
      } catch (error) {
        console.log("Error", error);
        toast.error(
          "Error occurred while fetching the feedback. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackDetails();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!interview || !feedback) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-2 flex flex-col gap-8" id="pdf-content">
      {/* Interview Info */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Interview Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around flex-col lg:flex-row">
          <p>
            <strong>Candidate:</strong> {interview.intervieweeName} -{" "}
            <span className="text-xs text-gray-700">
              {interview.intervieweeEmail}
            </span>
          </p>
          <p>
            <strong>Interviewer:</strong> {interview.interviewerName} -{" "}
            <span className="text-xs text-gray-700">
              {interview.interviewerEmail}
            </span>
          </p>
          <p>
            <strong>Position:</strong> {interview.position}
          </p>
          <p>
            <strong>Status:</strong> {interview.stage}
          </p>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            Status:{" "}
            <span className="font-semibold">{feedback.finalDecision}</span>
          </div>
          <div>
            Comment:{" "}
            <span className="font-semibold">{feedback.finalComment}</span>
          </div>
        </CardContent>
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
              {feedback.feedback.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
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
