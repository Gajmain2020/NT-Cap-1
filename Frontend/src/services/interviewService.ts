import { GetUpcomingInterviewHrAPI, ScheduleInterviewAPI } from "@/api/hrApis";
import { ExtendedScheduledInterview, IInterview } from "@/utils/types";
import { interviewConfirmSchema } from "@/utils/validationSchema";
import { toast } from "sonner";

export const getUpcomingInterviewHr = async (
  setLoading: (arg: boolean) => void,
  setInterviews: (
    update: (prev: ExtendedScheduledInterview[]) => ExtendedScheduledInterview[]
  ) => void
) => {
  try {
    const response = await GetUpcomingInterviewHrAPI();

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setInterviews(() => response.interviews);
  } catch (error) {
    console.error("Interview Schedule Error:", error);
    toast.error(
      "Failed to fetch upcoming interviews. Please try refresh again."
    );
  } finally {
    setLoading(false);
  }
};

export const scheduleInterview = async (
  formData: IInterview,
  interviewer: { interviewerName: string; interviewerEmail: string },
  setLoading: (loading: boolean) => void,
  setInterviews: (
    update: (prev: ExtendedScheduledInterview[]) => ExtendedScheduledInterview[]
  ) => void,
  setFormData: (data: IInterview) => void,
  setInterviewer: (data: {
    interviewerName: string;
    interviewerEmail: string;
  }) => void,
  setDialogOpen: (open: boolean) => void
) => {
  setLoading(true);
  try {
    const isValidInterviewer = interviewConfirmSchema.safeParse(interviewer);

    if (!isValidInterviewer.success) {
      isValidInterviewer.error.issues.forEach((err) =>
        toast.error(err.message)
      );
      return;
    }

    const finalData = {
      ...formData,
      interviewerName: interviewer.interviewerName,
      interviewerEmail: interviewer.interviewerEmail,
    };

    const response = await ScheduleInterviewAPI(finalData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success("Interview scheduled successfully!");
    setInterviews((prevInterviews) => [
      finalData as ExtendedScheduledInterview,
      ...prevInterviews,
    ]);
    setFormData({
      intervieweeName: "",
      intervieweeEmail: "",
      resumeLink: "",
      position: "",
      date: "",
      startTime: "",
      endTime: "",
      meetLink: "",
    });
    setInterviewer({
      interviewerName: "",
      interviewerEmail: "",
    });
    setDialogOpen(false);
  } catch (error) {
    console.error("Interview Schedule Error:", error);
    toast.error("Failed to schedule interview. Please try again.");
  } finally {
    setLoading(false);
  }
};
