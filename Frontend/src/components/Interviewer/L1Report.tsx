import { Dispatch, SetStateAction } from "react";

import Loading from "@/pages/Loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
          <DialogHeader>No interview feedback found.</DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {loading ? (
          <>
            <DialogHeader>
              <DialogTitle>L1 Feedback</DialogTitle>
            </DialogHeader>
            <p>This is l1 feedback</p>
          </>
        ) : (
          <Loading />
        )}
      </DialogContent>
    </Dialog>
  );
}
