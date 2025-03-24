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
