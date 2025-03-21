import { toast } from "sonner";
import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1/user";

const storedData = localStorage.getItem("cap-auth-storage");
const authToken = storedData ? JSON.parse(storedData)?.state?.authToken : null;

const headers = {
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
};

export async function LoginUserApi(loginData: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios({
      url:
        baseUrl +
        `/login?email=${loginData.email}&password=${loginData.password}`,
      method: "POST",
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

export async function ChangeUserPasswordApi(passwords: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const response = await axios({
      headers,
      url:
        baseUrl +
        `/change-password?oldPassword=${passwords.oldPassword}&newPassword=${passwords.newPassword}&confirmPassword=${passwords.confirmPassword}`,
      method: "POST",
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
