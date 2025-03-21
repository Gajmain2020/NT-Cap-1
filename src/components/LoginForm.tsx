import { Eye, EyeOff, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { loginSchema } from "@/utils/validationSchema";
import { toast } from "sonner";
import useAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setName, setAuthToken, setId, setUserType } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      result.error.issues.map((err) => toast.error(err.message));
      return;
    }

    //api to be integrated here

    //! setting dummy user as hr for the time being
    setName(email);
    setUserType("interviewer");
    setAuthToken("123");
    setId("i1");

    navigate(`hr/${email}`);

    console.log("Login successful", email, password);
  };
  return (
    <div className="w-full max-w-xl h-full mx-auto bg-gray-200 rounded-lg shadow-lg p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Login
      </h2>

      <div className="grid gap-4">
        {/* Email input */}
        <div className="relative ">
          <Input
            type="email"
            placeholder="Enter your email"
            className="pr-10 text-black border-gray-300 focus:border-blue-500"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute right-3 top-1.5 text-gray-500" />
        </div>

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

      {/* Login Button */}
      <Button
        onClick={handleLogin}
        className="cursor-pointer w-full bg-teal-500 hover:bg-teal-600 hover:shadow text-white font-medium py-2 px-4 rounded-lg"
      >
        Login
      </Button>
    </div>
  );
}
