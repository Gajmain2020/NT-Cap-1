import { toast } from "sonner";

import { loginSchema, registerSchema } from "@/utils/validationSchema";
import { LoginUserApi, RegisterUserApi } from "@/api/userApis";

export async function handleUserRegistration(
  registerData: { email: string; password: string; name: string; role: string },
  setLoading: (loading: boolean) => void,
  setIsRegister: (value: boolean) => void
) {
  setLoading(true);
  try {
    const result = registerSchema.safeParse(registerData);

    if (!result.success) {
      result.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    const response = await RegisterUserApi(registerData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success("Registration successful! Please login.");
    setIsRegister(false);
  } catch (error) {
    console.error("Registration Error:", error);
    toast.error("An unexpected error occurred.");
  } finally {
    setLoading(false);
  }
}

export async function handleUserLogin(
  loginData: { email: string; password: string },
  setLoading: (loading: boolean) => void,
  setName: (name: string) => void,
  setUserType: (role: "hr" | "interviewer") => void,
  setAuthToken: (token: string) => void,
  setId: (id: string) => void,
  navigate: (path: string) => void
) {
  setLoading(true);
  try {
    const result = loginSchema.safeParse(loginData);

    if (!result.success) {
      result.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    // API call
    const response = await LoginUserApi(loginData);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    //! Store the user details
    setName(response.data.name);
    setUserType(response.data.role.toLowerCase());
    setAuthToken(response.data.token);
    setId(response.data.id);

    navigate(`${response.data.role}/${response.data.id}`);
    toast.success("Login Successful.");
  } catch (error) {
    console.error("Login Error:", error);
    toast.error("Failed to login. Please check your credentials.");
  } finally {
    setLoading(false);
  }
}
