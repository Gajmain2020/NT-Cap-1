import { Dispatch, SetStateAction } from "react";

import Loading from "@/pages/Loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export interface FeedbackDetail {
  topics: string[];
  comments: string;
  skill: string;
  rating: "VERY_GOOD" | "GOOD" | "AVERAGE" | "BELOW_AVERAGE" | "POOR"; // Adjust based on possible values
}

export interface IInterviewFeedback {
  details: FeedbackDetail[];
  finalComment: string;
  finalDecision: string; // You can use an enum if values are fixed
}

export default function L1Report({
  open,
  loading,
  pastFeedback,
  onOpenChange,
}: {
  open: boolean;
  loading: boolean;
  pastFeedback: IInterviewFeedback | undefined;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  if (!loading && !pastFeedback) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>L1 Feedback</DialogTitle>
          </DialogHeader>
          <p>No feedback details found.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[60vw]">
        {!loading ? (
          <>
            <DialogHeader>
              <DialogTitle>L1 Feedback</DialogTitle>
            </DialogHeader>

            <div className="overflow-hidden flex flex-col gap-4">
              {/* For final comment */}
              <div>
                <h2 className="text-lg font-semibold">Final Comment</h2>
                <p className="italic">{pastFeedback?.finalComment}</p>
              </div>

              {/* For evaluated skills */}
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Sr No.
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Skill
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Rating
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Topics Evaluated
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Comments
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pastFeedback?.details.map((item, index) => (
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
                          {item.topics.join(", ")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.comments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </DialogContent>
    </Dialog>
  );
}
