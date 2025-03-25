import { apiRequest } from "@/utils/ApiWrapper";
import { IFeedbackEntry } from "@/utils/types";

const baseUrl = "http://localhost:8080/api/v1/schedules";

const storedData = localStorage.getItem("cap-auth-storage");
const authToken = storedData ? JSON.parse(storedData)?.state?.authToken : null;

const headers = {
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
};

export async function FetchUpcomingInterviewerInterviews() {
  return apiRequest({
    headers,
    url: baseUrl + `/upcoming-interviews-interviewer`,
    method: "GET",
  });
}

export async function FetchOngoingInterviewerInterviews() {
  return apiRequest({
    headers,
    url: baseUrl + `/ongoing-interviews-interviewer`,
    method: "GET",
  });
}

export async function FetchIntervieweeDetailsAPI(interviewId: string) {
  return apiRequest({
    headers,
    url: baseUrl + `/interviewee-details/${interviewId}`,
    method: "GET",
  });
}

export async function SubmitFeedbackAPI(
  feedbackData: IFeedbackEntry[],
  interviewId: string | undefined,
  finalResult: string,
  finalComment: string
) {
  //process the feedback data
  const transformedData = feedbackData.map((data) => ({
    ...data,
    topics: data.topics.join(", "),
  }));

  return apiRequest({
    headers,
    url: baseUrl + `/submit-feedback/${interviewId}`,
    method: "POST",
    data: {
      finalResult,
      feedback: transformedData,
      finalComment,
    },
  });
}

export async function CheckFeedbackFilledAPI(interviewId: string | undefined) {
  return apiRequest({
    headers,
    url: baseUrl + `/check-feedback-filled/${interviewId}`,
    method: "GET",
  });
}

export async function GetAllInterviewsOfInterviewerAPI() {
  return apiRequest({
    headers,
    url: baseUrl + `/get-interviewer-interview`,
    method: "GET",
  });
}

export async function FetchInterviewerPastFeedbacksAPI() {
  return apiRequest({
    headers,
    url: baseUrl + `/interviewer-past-feedbacks`,
    method: "GET",
  });
}

export async function FetchFeedbackDetailsAPI(feedbackId: string) {
  return apiRequest({
    headers,
    url: baseUrl + `/feedback-details/${feedbackId}`,
    method: "GET",
  });
}
