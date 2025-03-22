import { toast } from "sonner";
import axios from "axios";
import { IScheduleInterview } from "@/utils/types";

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
