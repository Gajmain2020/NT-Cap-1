import { toast } from "sonner";

import { EditScheduleInterviewAPI } from "@/api/hrApis";
import { ExtendedScheduledInterview } from "@/utils/types";
import { editScheduledSchema } from "@/utils/validationSchema";

export const handleEditScheduledInterviewService = async (
  selectedInterview: ExtendedScheduledInterview | null,
  setInterviews: React.Dispatch<
    React.SetStateAction<ExtendedScheduledInterview[]>
  >,
  setRescheduling: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedInterview: React.Dispatch<
    React.SetStateAction<ExtendedScheduledInterview | null>
  >
) => {
  try {
    if (!selectedInterview) return;

    const validateData = editScheduledSchema.safeParse(selectedInterview);
    if (!validateData.success) {
      validateData.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    const response = await EditScheduleInterviewAPI(selectedInterview);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setInterviews((prevInterviews) =>
      prevInterviews.map((i) =>
        i.id !== selectedInterview.id ? i : selectedInterview
      )
    );

    toast.success("Interview schedule updated successfully.");
    setSelectedInterview(null);
  } catch (error) {
    console.error("Interview Schedule Error:", error);
    toast.error("Failed to schedule interview. Please try again.");
  } finally {
    setRescheduling(false);
  }
};
