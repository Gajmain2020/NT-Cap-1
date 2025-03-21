import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([
    { id: 1, skill: "Basic Algorithm", rating: "", topics: [], comments: "" },
    { id: 2, skill: "Code and Syntax", rating: "", topics: [], comments: "" },
    { id: 3, skill: "Design Patterns", rating: "", topics: [], comments: "" },
    { id: 4, skill: "SQL", rating: "", topics: [], comments: "" },
    { id: 5, skill: "Git", rating: "", topics: [], comments: "" },
    { id: 6, skill: "Overall Attitude", rating: "", topics: [], comments: "" },
    { id: 7, skill: "Learning Ability", rating: "", topics: [], comments: "" },
    {
      id: 8,
      skill: "Resume Explanation",
      rating: "",
      topics: [],
      comments: "",
    },
    { id: 9, skill: "Communication", rating: "", topics: [], comments: "" },
  ]);
  const [newSkill, setNewSkill] = useState<{
    skill: string;
    rating: string;
    topics: string[];
    comment: string;
  }>({
    skill: "",
    rating: "",
    topics: [],
    comment: "",
  });

  const ratingOptions = [
    "Average",
    "Good",
    "Not Evaluated",
    "Poor",
    "Very Good",
  ];
  const topicOptions = {
    "Basic Algorithm": ["Search Algorithms", "Sorting", "Recursion"],
    "Code and Syntax": ["Code Optimization", "Algorithm Implementation"],
    "Design Patterns": ["Singleton", "Factory", "Observer"],
    SQL: ["Joins", "Subqueries", "Indexing", "Normalization"],
    Git: ["Git Commands", "Branching", "Merging"],
    "Overall Attitude": ["Attitude during interview"],
    "Learning Ability": ["Learning New Concepts"],
    "Resume Explanation": ["Relevant Experience", "Projects"],
    Communication: ["Clarity of Thoughts", "Communication Skills"],
  };

  const handleAddSkill = () => {
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

  // const handleDeleteSkill = (index) => {
  //   setFeedback(feedback.filter((_, i) => i !== index));
  // };

  interface FeedbackEntry {
    id: number;
    skill: string;
    rating: string;
    topics: string[];
    comments: string;
  }

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submit Feedback</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Sr No.</th>
                <th className="border border-gray-300 px-4 py-2">Skill</th>
                <th className="border border-gray-300 px-4 py-2">Rating</th>
                <th className="border border-gray-300 px-4 py-2">
                  Topics Used for Evaluation
                </th>
                <th className="border border-gray-300 px-4 py-2">Comments</th>
                {/* <th className="border border-gray-300 px-4 py-2">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {feedback.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.skill}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Select
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
                          setNewSkill((skills) => ({
                            ...skills,
                            topics: [...skills.topics, value],
                          }));
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
                      type="text"
                      placeholder="Add specific comments"
                      value={entry.comments}
                      onChange={(e) => {
                        const updatedFeedback = [...feedback];
                        updatedFeedback[index].comments = e.target.value;
                        setFeedback(updatedFeedback);
                      }}
                    />
                  </td>
                  {/* <td className="border border-gray-300 px-4 py-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSkill(index)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <NewSkillForm
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            // ratingOptions={ratingOptions}
            handleAddSkill={handleAddSkill}
          />

          <Button className="mt-6" onClick={() => navigate("/submit-feedback")}>
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface NewSkillFormProps {
  newSkill: {
    skill: string;
    rating: string;
    topics: string[];
    comment: string;
  };
  setNewSkill: React.Dispatch<
    React.SetStateAction<{
      skill: string;
      rating: string;
      topics: string[];
      comment: string;
    }>
  >;
  handleAddSkill: () => void;
}

function NewSkillForm({
  newSkill,
  setNewSkill,
  handleAddSkill,
}: NewSkillFormProps) {
  return (
    <div className="border border-gray-300 p-4 rounded-lg mt-6">
      <h2 className="text-lg font-semibold mb-3">Add New Skill</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Skill Name */}
        <Input
          type="text"
          placeholder="Enter Skill Name"
          value={newSkill.skill}
          onChange={(e) =>
            setNewSkill((prev) => ({ ...prev, skill: e.target.value }))
          }
        />

        {/* Rating */}
        <Input
          type="text"
          placeholder="Enter Rating"
          value={newSkill.rating}
          onChange={(e) =>
            setNewSkill((prev) => ({ ...prev, rating: e.target.value }))
          }
        />

        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {newSkill.topics.map((topic, topicIndex) => (
              <Badge
                key={topic}
                className="cursor-pointer"
                onClick={() => {
                  const updatedTopics = newSkill.topics.filter(
                    (_, i) => i !== topicIndex
                  );
                  setNewSkill((skill) => ({
                    ...skill,
                    topics: updatedTopics,
                  }));
                }}
              >
                {topic} ×
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Select or Type"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target as HTMLInputElement).value.trim() !== "" &&
                !newSkill.topics?.includes((e.target as HTMLInputElement).value)
              ) {
                setNewSkill((skills) => ({
                  ...skills,
                  topics: [
                    ...skills.topics,
                    (e.target as HTMLInputElement).value,
                  ],
                }));
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
        </div>

        {/* Comment */}
        <Input
          type="text"
          placeholder="Enter Comment"
          value={newSkill.comment}
          onChange={(e) =>
            setNewSkill((prev) => ({ ...prev, comment: e.target.value }))
          }
        />
      </div>

      {/* Add Skill Button */}
      <Button className="mt-4" onClick={handleAddSkill}>
        Add Skill
      </Button>
    </div>
  );
}
