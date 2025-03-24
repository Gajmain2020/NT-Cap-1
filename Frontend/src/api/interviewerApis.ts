import { IFeedbackEntry } from "@/utils/types";
import axios from "axios";
import { toast } from "sonner";

const baseUrl = "http://localhost:8080/api/v1/schedules";

const storedData = localStorage.getItem("cap-auth-storage");
const authToken = storedData ? JSON.parse(storedData)?.state?.authToken : null;

const headers = {
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
};

export async function FetchUpcomingInterviewerInterviews() {
  try {
    const response = await axios({
      headers,
      url: baseUrl + `/upcoming-interviews-interviewer`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export async function FetchOngoingInterviewerInterviews() {
  try {
    const response = await axios({
      headers,
      url: baseUrl + `/ongoing-interviews-interviewer`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export async function FetchIntervieweeDetailsAPI(interviewId: string) {
  try {
    const response = await axios({
      headers,
      url: baseUrl + `/interviewee-details/${interviewId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export async function SubmitFeedbackAPI(
  feedbackData: IFeedbackEntry[],
  interviewId: string | undefined,
  finalResult: string
) {
  try {
    //process the feedback data
    const transformedData = feedbackData.map((data) => ({
      ...data,
      topics: data.topics.join(", "),
    }));

    console.log(transformedData);

    const response = await axios({
      headers,
      url: baseUrl + `/submit-feedback/${interviewId}`,
      method: "POST",
      data: { finalResult: finalResult, feedback: transformedData },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}
