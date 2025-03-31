import { apiRequest } from "@/utils/ApiWrapper";
import { getAuthHeaders } from "@/utils/authHeaders";
import { IFeedbackEntry } from "@/utils/types";

const baseUrl = "http://localhost:8080/api/v1/schedules";

export async function FetchUpcomingInterviewerInterviews() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/upcoming-interviews-interviewer`,
    method: "GET",
  });
}

export async function FetchOngoingInterviewerInterviews() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/ongoing-interviews-interviewer`,
    method: "GET",
  });
}

export async function FetchIntervieweeDetailsAPI(interviewId: string) {
  return apiRequest({
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    url: baseUrl + `/check-feedback-filled/${interviewId}`,
    method: "GET",
  });
}

export async function GetAllInterviewsOfInterviewerAPI() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/get-interviewer-interview`,
    method: "GET",
  });
}

export async function FetchInterviewerPastFeedbacksAPI() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/interviewer-past-feedbacks`,
    method: "GET",
  });
}

export async function FetchFeedbackDetailsAPI(feedbackId: string) {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/get-feedback-details-interviewer/${feedbackId}`,
    method: "GET",
  });
}
