import { apiRequest } from "@/utils/ApiWrapper";
import { getAuthHeaders } from "@/utils/authHeaders";
import { IScheduleInterview } from "@/utils/types";

const baseUrl = "http://localhost:8080/api/v1/schedules";

export async function ScheduleInterviewAPI(data: IScheduleInterview) {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/add-interview`,
    method: "POST",
    data,
  });
}

export async function GetUpcomingInterviewHrAPI() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + "/upcoming-interviews-hr",
    method: "GET",
  });
}

export async function EditScheduleInterviewAPI(
  data: IScheduleInterview & { id: string }
) {
  const interviewId = data.id;

  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/edit-scheduled-interview/${interviewId}`,
    method: "PUT",
    data,
  });
}

export async function FetchInterviewsAPI() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/interviews-hr`,
    method: "GET",
  });
}

export async function FetchPastInterviewsAPI() {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/get-past-interviews`,
    method: "GET",
  });
}

export async function GetFeedbackDetailsAPI(interviewId: string) {
  return apiRequest({
    headers: getAuthHeaders(),
    url: baseUrl + `/get-feedback-details-hr/${interviewId}`,
    method: "GET",
  });
}
