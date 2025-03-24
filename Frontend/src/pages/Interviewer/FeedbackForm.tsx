import IntervieweeDetails from "@/components/Interviewer/IntervieweeDetails";
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
import { FeedbackEntry, ISkill } from "@/utils/types";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(fixedForm);
  const [newSkill, setNewSkill] = useState<ISkill>({
    skill: "",
    rating: "",
    topics: [],
    comment: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  };

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
    setNewSkill({
      skill: "",
      rating: "",
      topics: [],
      comment: "",
    });
  };

  const handleAddTopic = (index: number, topic: string): void => {
    const updatedFeedback: FeedbackEntry[] = [...feedback];
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
    const isValid = feedback.some(
      (entry) => entry.rating || entry.topics.length > 0 || entry.comments
    );

    if (isValid) {
      setIsDialogOpen(true);
    } else {
      toast.error("Please provide feedback for at least one skill.");
    }
  };

  const confirmSubmit = () => {
    console.log("Submitted Feedback:", feedback);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submit Feedback</h1>
      <Card className="flex flex-col gap-6">
        <IntervieweeDetails />

        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
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
                        handleCheckboxChange(entry.id, Boolean(checked))
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
                        SelectD
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
