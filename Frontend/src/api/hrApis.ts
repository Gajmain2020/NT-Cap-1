import { apiRequest } from "@/utils/ApiWrapper";
import { IScheduleInterview } from "@/utils/types";

const baseUrl = "http://localhost:8080/api/v1/schedules";

const storedData = localStorage.getItem("cap-auth-storage");
const authToken = storedData ? JSON.parse(storedData)?.state?.authToken : null;

const headers = {
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
};

export async function ScheduleInterviewAPI(data: IScheduleInterview) {
  return apiRequest({
    headers,
    url: baseUrl + `/add-interview`,
    method: "POST",
    data,
  });
}

export async function GetUpcomingInterviewHrAPI() {
  return apiRequest({
    headers,
    url: baseUrl + "/upcoming-interviews-hr",
    method: "GET",
  });
}

export async function EditScheduleInterviewAPI(
  data: IScheduleInterview & { id: string }
) {
  const interviewId = data.id;

  return apiRequest({
    headers,
    url: baseUrl + `/edit-scheduled-interview/${interviewId}`,
    method: "PUT",
    data,
  });
}

export async function FetchInterviewsAPI() {
  return apiRequest({
    headers,
    url: baseUrl + `/interviews-hr`,
    method: "GET",
  });
}
