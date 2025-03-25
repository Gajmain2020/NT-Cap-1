import { apiRequest } from "@/utils/ApiWrapper";

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
    headers,
    url:
      baseUrl +
      `/change-password?oldPassword=${passwords.oldPassword}&newPassword=${passwords.newPassword}&confirmPassword=${passwords.confirmPassword}`,
    method: "PUT",
  });
}
