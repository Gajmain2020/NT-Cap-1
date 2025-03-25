import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const apiRequest = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};
