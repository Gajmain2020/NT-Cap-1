import { toast } from "sonner";

import {
  loginSchema,
  passwordChangeSchema,
  registerSchema,
} from "@/utils/validationSchema";
import {
  ChangeUserPasswordApi,
  LoginUserApi,
  RegisterUserApi,
} from "@/api/userApis";

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

export async function changePassword(
  passwords: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  setPasswords: (passwords: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void,
  setLoading: (loading: boolean) => void,
  setOpen: (open: boolean) => void
) {
  setLoading(true);
  try {
    const checkSchema = passwordChangeSchema.safeParse(passwords);

    if (!checkSchema.success) {
      checkSchema.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and Confirm password must match.");
      return;
    }

    const response = await ChangeUserPasswordApi(passwords);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success("Password changed successfully!");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setOpen(false);
  } catch (error) {
    console.error("Password Change Error:", error);
    toast.error("Failed to change password. Please try again.");
  } finally {
    setLoading(false);
  }
}
