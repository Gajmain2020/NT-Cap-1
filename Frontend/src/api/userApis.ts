import { apiRequest } from "@/utils/ApiWrapper";
import { getAuthHeaders } from "@/utils/authHeaders";

const baseUrl = "http://localhost:8080/api/v1/user";

export async function LoginUserApi(loginData: {
  email: string;
  password: string;
}) {
  return apiRequest({
    url:
      baseUrl +
      `/login?email=${loginData.email}&password=${loginData.password}`,
    method: "POST",
  });
}

export async function RegisterUserApi(registerData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  return apiRequest({
    url: baseUrl + "/register",
    method: "POST",
    data: registerData,
  });
}

export async function ChangeUserPasswordApi(passwords: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  await apiRequest({
    headers: getAuthHeaders(),
    url:
      baseUrl +
      `/change-password?oldPassword=${passwords.oldPassword}&newPassword=${passwords.newPassword}&confirmPassword=${passwords.confirmPassword}`,
    method: "PUT",
  });
}
