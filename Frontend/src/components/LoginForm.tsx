import { Eye, EyeOff, Mail, User } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { loginSchema, registerSchema } from "@/utils/validationSchema";
import { toast } from "sonner";
import useAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RegisterUserApi } from "@/api/userApis";

export default function AuthForm() {
  const navigate = useNavigate();
  const { setName, setAuthToken, setId, setUserType } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setNameInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // parse for any error in the input
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      result.error.issues.map((err) => toast.error(err.message));
      return;
    }

    //api to be integrated here
    setName(email);
    setUserType("interviewer");
    setAuthToken("123");
    setId("i1");

    navigate(`hr/${email}`);
    console.log("Login successful", email, password);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = registerSchema.safeParse({ name, email, role, password });

      if (!result.success) {
        result.error.issues.map((err) => toast.error(err.message));
        return;
      }

      const response = await RegisterUserApi({ name, email, role, password });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Registration successful! Please login.");
      setIsRegister(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl h-full mx-auto bg-gray-200 rounded-lg shadow-lg p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        {isRegister ? "Register" : "Login"}
      </h2>

      <div className="grid gap-4">
        {isRegister && (
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your name"
              className="pr-10 text-black border-gray-300 focus:border-blue-500"
              required
              onChange={(e) => setNameInput(e.target.value)}
            />
            <User className="absolute right-3 top-1.5 text-gray-500" />
          </div>
        )}

        {/* Email input */}
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter your email"
            className="pr-10 text-black border-gray-300 focus:border-blue-500"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute right-3 top-1.5 text-gray-500" />
        </div>

        {isRegister && (
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="text-black border-gray-300 w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent className="w-full flex">
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="INTERVIEWER">Interviewer</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Password Input */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-10 text-black border-gray-300 focus:border-blue-500"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-1.5 text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Eye
              className="absolute right-3 top-1.5 text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        disabled={loading}
        onClick={isRegister ? handleRegister : handleLogin}
        className="cursor-pointer w-full bg-teal-500 hover:bg-teal-600 hover:shadow text-white font-medium py-2 px-4 rounded-lg"
      >
        {isRegister
          ? loading
            ? "Registering..."
            : "Register"
          : loading
          ? "Logging you in..."
          : "Login"}
      </Button>

      {/* Toggle Button */}
      <p className="text-center text-gray-600">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsRegister(!isRegister)}
          className="text-teal-600 cursor-pointer hover:underline transition"
        >
          {isRegister ? "Login now" : "Create one now"}
        </span>
      </p>
    </div>
  );
}
