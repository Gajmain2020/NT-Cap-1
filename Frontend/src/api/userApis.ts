import { toast } from "sonner";
import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1/user";

export async function LoginUserApi(loginData: {
  email: string;
  password: string;
}) {
  console.log(loginData);
}

export async function RegisterUserApi(registerData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  try {
    const response = await axios({
      url: baseUrl + "/register",
      method: "POST",
      data: registerData,
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
