import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  ratingOptions: string[];
}

export default function NewSkillForm({
  newSkill,
  setNewSkill,
  handleAddSkill,
  ratingOptions,
}: NewSkillFormProps) {
  return (
    <div className="border border-gray-300 p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Skill</h2>

      <div className="grid lg:grid-cols-3  gap-4">
        {/* Skill Name */}
        <Input
          type="text"
          placeholder="Skill Name*"
          value={newSkill.skill}
          onChange={(e) =>
            setNewSkill((prev) => ({ ...prev, skill: e.target.value }))
          }
        />

        {/* Rating */}
        <Select
          onValueChange={(value) => {
            setNewSkill((prev) => ({ ...prev, rating: value }));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Rating*" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {/* Topics Input & Chips */}
      <div className="mt-4">
        {/* Scrollable Topic Chips */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-md min-h-[40px] max-h-[80px] overflow-y-auto">
          {newSkill.topics.map((topic, topicIndex) => (
            <Badge
              key={topic}
              className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
              onClick={() => {
                setNewSkill((prev) => ({
                  ...prev,
                  topics: prev.topics.filter((_, i) => i !== topicIndex),
                }));
              }}
            >
              {topic} ×
            </Badge>
          ))}
        </div>

        {/* Topic Input */}
        <Input
          type="text"
          placeholder="Enter topic & press Enter"
          className="mt-2"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLInputElement).value.trim() !== "" &&
              !newSkill.topics.includes((e.target as HTMLInputElement).value)
            ) {
              setNewSkill((prev) => ({
                ...prev,
                topics: [...prev.topics, (e.target as HTMLInputElement).value],
              }));
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>

      {/* Add Skill Button */}
      <Button className="mt-5" onClick={handleAddSkill}>
        Add Skill
      </Button>
    </div>
  );
}
