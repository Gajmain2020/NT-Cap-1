import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  CheckFeedbackFilledAPI,
  FetchFeedbackDetailsViaInterviewIdAPI,
  FetchIntervieweeDetailsAPI,
  SubmitFeedbackAPI,
} from "@/api/interviewerApis";
import IntervieweeDetails from "@/components/Interviewer/IntervieweeDetails";
import L1Report from "@/components/Interviewer/L1Report";
import NewSkillForm from "@/components/Interviewer/NewSkillForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { fixedForm, ratingOptions, topicOptions } from "@/lib/utils";
import { IFeedbackEntry, IIntervieweeDetails, ISkill } from "@/utils/types";

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

export default function FeedbackForm() {
  const navigate = useNavigate();
  const { interviewId } = useParams<string>();

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interviewee, setInterviewee] = useState<IIntervieweeDetails>();
  const [feedback, setFeedback] = useState<IFeedbackEntry[]>(fixedForm);
  const [finalFeedback, setFinalFeedback] = useState("");
  const [finalComment, setFinalComment] = useState("");
  const [newSkill, setNewSkill] = useState<ISkill>({
    skill: "",
    rating: "",
    topics: [],
    comment: "",
  });

  // For past interview feedback
  const [showL1Report, setShowL1Report] = useState(false);
  const [pastFeedbackReport, setPastFeedbackReport] =
    useState<IInterviewFeedback>();
  const [fetchingPastFeedbackReport, setFetchingPastFeedbackReport] =
    useState(false);

  const [isFeedbackFilled, setIsFeedbackFilled] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stageOptions =
    interviewee?.stage === "L1"
      ? ["L1 Passed", "L1 Passed with comment", "Rejected"]
      : ["L2 Passed", "Rejected"];

  useEffect(() => {
    const fetchPastReport = async () => {
      setFetchingPastFeedbackReport(true);
      try {
        if (!interviewee?.l1Id) {
          toast.error("Invalid L1 ID.");
          return;
        }
        const response = await FetchFeedbackDetailsViaInterviewIdAPI(
          interviewee.l1Id
        );
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        setPastFeedbackReport(response.feedback);
      } catch (error) {
        console.log(
          "Error occurred while fetching the past interview feedback.",
          error
        );
        toast.error(
          "Error occurred while fetching the past interview feedback."
        );
      } finally {
        setFetchingPastFeedbackReport(false);
      }
    };

    if (!pastFeedbackReport) {
      fetchPastReport();
    }
  }, [showL1Report]);

  useEffect(() => {
    const checkIsFeedbackAlreadyFilled = async () => {
      try {
        if (!interviewId) {
          toast.error("Invalid interviewee ID.");
          return;
        }
        const response = await CheckFeedbackFilledAPI(interviewId);

        if (!response.success) {
          toast.error("Failed to fetch interviewee details.");
          return;
        }

        setIsFeedbackFilled(response.status);
      } catch (error) {
        console.log("Error occurred", error);
        toast.error("Error occurred while checking for feedback.");
      }
    };
    checkIsFeedbackAlreadyFilled();
  }, []);

  useEffect(() => {
    const fetchIntervieweeDetails = async (interviewId: string | undefined) => {
      try {
        if (!interviewId) {
          toast.error("Invalid interviewee ID.");
          return;
        }

        const response = await FetchIntervieweeDetailsAPI(interviewId);

        if (!response.success) {
          toast.error("Failed to fetch interviewee details.");
          return;
        }

        setInterviewee(response.interviewee);
      } catch (error) {
        console.log("Error occurred: ", error);
        toast.error(
          "Error while fetching interviewee details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIntervieweeDetails(interviewId);
  }, []);

  const handleAddSkill = () => {
    if (newSkill.rating === "" || newSkill.skill === "") {
      toast.error("Please fill in all required fields.");
      return;
    }
    setFeedback([
      ...feedback,
      {
        id: feedback.length + 1,
        skill: newSkill.skill,
        rating: newSkill.rating,
        topics: newSkill.topics,
        comments: newSkill.comment,
      },
    ]);
    setCheckedItems((items) => ({ ...items, [feedback.length + 1]: true }));
    setNewSkill({
      skill: "",
      rating: "",
      topics: [],
      comment: "",
    });
  };

  const handleAddTopic = (index: number, topic: string): void => {
    const updatedFeedback: IFeedbackEntry[] = [...feedback];
    if (!updatedFeedback[index].topics.includes(topic)) {
      updatedFeedback[index].topics.push(topic);
      setFeedback(updatedFeedback);
    }
  };

  const handleRemoveTopic = (index: number, topic: string) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index].topics = updatedFeedback[index].topics.filter(
      (t) => t !== topic
    );
    setFeedback(updatedFeedback);
  };

  const handleSubmit = () => {
    if (finalFeedback === "") {
      toast.error("Please fill in your final feedback.");
      return;
    }
    const isValid = feedback.some(
      (entry) => entry.rating || entry.topics.length > 0 || entry.comments
    );
    if (isValid) {
      setIsDialogOpen(true);
    } else {
      toast.error("Please provide feedback for at least one skill.");
    }
  };

  const confirmSubmit = async () => {
    const feedbackData = Object.keys(checkedItems)
      .filter((key) => checkedItems[Number(key)] === true) // Keep only checked items
      .map((key) => feedback[Number(key) - 1]); // Get corresponding feedback values

    try {
      setSubmitting(true);

      const response = await SubmitFeedbackAPI(
        feedbackData,
        interviewId,
        finalFeedback,
        finalComment
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setIsDialogOpen(false);
      toast.success("Feedback submitted successfully!");
      setIsFeedbackFilled(true);
    } catch (error) {
      console.log("Error occurred:", error);
      toast.error("Can't submit the feedback not. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isFeedbackFilled) {
    return (
      <div className="flex items-center justify-center flex-col gap-4">
        <img
          className="w-72 rounded-lg shadow-xl"
          src="https://static.vecteezy.com/system/resources/previews/044/085/145/non_2x/dependencies-filled-shadow-icon-vector.jpg"
          alt=""
        />
        <div className="flex items-center justify-center flex-col gap-2">
          <h1 className="text-2xl">Feedback successfully!!</h1>
          <p className="text-center text-gray-600">
            The feedback of{" "}
            <i className="font-semibold underline">
              {interviewee?.intervieweeName}
            </i>{" "}
            has been filled successfully.
          </p>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Go to homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="flex flex-col gap-6">
        <IntervieweeDetails loading={loading} interviewee={interviewee} />

        <CardHeader>
          <CardTitle className="text-center text-xl underline">
            Feedback Form
          </CardTitle>
        </CardHeader>

        {/* Select Component for Stage Options */}
        <CardContent className="relative flex flex-col gap-2">
          {interviewee?.stage === "L2" && (
            <div className="lg:absolute sm:flex top-0 right-0 lg:p-2">
              <Button variant="secondary" onClick={() => setShowL1Report(true)}>
                View L1 Feedback
              </Button>
            </div>
          )}
          <div>Final Result</div>
          <Select
            value={finalFeedback}
            onValueChange={(value) => setFinalFeedback(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Option" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            onChange={(e) => setFinalComment(e.target.value)}
            placeholder="Type overall comment if any."
          />
        </CardContent>

        <CardContent className="overflow-x-auto">
          <div>Feedbacks</div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Select</th>
                <th className="border border-gray-300 px-4 py-2">Skill</th>
                <th className="border border-gray-300 px-4 py-2">Rating</th>
                <th className="border border-gray-300 px-4 py-2">
                  Topics Used for Evaluation
                </th>
                <th className="border border-gray-300 px-4 py-2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <Checkbox
                      className="cursor-pointer"
                      onCheckedChange={(checked) =>
                        setCheckedItems((prev) => ({
                          ...prev,
                          [entry.id]: !!checked,
                        }))
                      }
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.skill}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Select
                      disabled={!checkedItems[entry.id]}
                      value={feedback[index].rating || undefined}
                      onValueChange={(value) => {
                        const updatedFeedback = [...feedback];
                        updatedFeedback[index].rating = value;
                        setFeedback(updatedFeedback);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {entry.topics.map((topic) => (
                        <Badge
                          key={topic}
                          className="cursor-pointer"
                          onClick={() => handleRemoveTopic(index, topic)}
                        >
                          {topic} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      disabled={!checkedItems[entry.id]}
                      type="text"
                      placeholder="Select or Type"
                      list={`topics-${entry.id}`}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          entry.skill in topicOptions &&
                          topicOptions[
                            entry.skill as keyof typeof topicOptions
                          ]?.includes(value)
                        ) {
                          handleAddTopic(index, value);
                          e.target.value = "";
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          (e.target as HTMLInputElement).value.trim() !== "" &&
                          !topicOptions[
                            entry.skill as keyof typeof topicOptions
                          ]?.includes((e.target as HTMLInputElement).value)
                        ) {
                          handleAddTopic(
                            index,
                            (e.target as HTMLInputElement).value.trim()
                          );
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <datalist id={`topics-${entry.id}`}>
                      {(
                        topicOptions[
                          entry.skill as keyof typeof topicOptions
                        ] || []
                      ).map((topic) => (
                        <option key={topic} value={topic} />
                      ))}
                    </datalist>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Input
                      disabled={!checkedItems[entry.id]}
                      type="text"
                      placeholder="Comments"
                      value={entry.comments}
                      onChange={(e) => {
                        const updatedFeedback = [...feedback];
                        updatedFeedback[index].comments = e.target.value;
                        setFeedback(updatedFeedback);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        <CardContent>
          <NewSkillForm
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            ratingOptions={ratingOptions}
            handleAddSkill={handleAddSkill}
          />
        </CardContent>

        <CardFooter>
          <Button className="mt-6" onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to submit the feedback?</p>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={submitting} onClick={confirmSubmit}>
              {submitting ? "Submitting" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for past interview report */}

      <L1Report
        pastFeedback={pastFeedbackReport}
        open={showL1Report}
        onOpenChange={setShowL1Report}
        loading={fetchingPastFeedbackReport}
      />
    </div>
  );
}
