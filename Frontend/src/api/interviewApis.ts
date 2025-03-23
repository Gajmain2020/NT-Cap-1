import { IScheduleInterview } from "@/utils/types";
import axios from "axios";
import { toast } from "sonner";

const baseUrl = "http://localhost:8080/api/v1/schedules";

const storedData = localStorage.getItem("cap-auth-storage");
const authToken = storedData ? JSON.parse(storedData)?.state?.authToken : null;

const headers = {
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
};

export async function ScheduleInterviewAPI(data: IScheduleInterview) {
  try {
    const response = await axios({
      headers,
      url: baseUrl + `/add-interview`,
      method: "POST",
      data,
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

export async function GetUpcomingInterviewHrAPI() {
  try {
    const response = await axios({
      headers,
      url: baseUrl + "/upcoming-interviews-hr",
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

export async function EditScheduleInterviewAPI(
  data: IScheduleInterview & { id: string }
) {
  const interviewId = data.id;

  try {
    const response = await axios({
      headers,
      url: baseUrl + `/edit-scheduled-interview/${interviewId}`,
      method: "PUT",
      data,
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

export async function FetchInterviewsAPI() {
  try {
    const response = await axios({
      headers,
      url: baseUrl + `/interviews-hr`,
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
