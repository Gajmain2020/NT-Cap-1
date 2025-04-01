import {
  handleUserLogin,
  handleUserRegistration,
} from "@/services/userService";
import useAuthStore from "@/store/userAuthStore";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

  const handleLogin = async () => {
    await handleUserLogin(
      { email, password },
      setLoading,
      setName,
      setUserType,
      setAuthToken,
      setId,
      navigate
    );
  };

  const handleRegister = async () => {
    await handleUserRegistration(
      { name, email, role, password },
      setLoading,
      setIsRegister
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isRegister) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div
      onKeyDown={(e) => handleKeyDown(e)}
      className="w-full max-w-xl h-full mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6"
    >
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
