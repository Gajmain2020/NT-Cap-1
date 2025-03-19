import LoginForm from "@/components/LoginForm";

export default function Landing() {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(211, 211, 211, 0.95), rgba(211, 211, 211, 0.85)), url("https://www.aihr.com/wp-content/uploads/interview-feedback-cover.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 min-h-screen flex items-center justify-center flex-col">
        <div className="flex items-center justify-center py-12 flex-col gap-2 ">
          <div className="font-light text-gray-600">Welcome to</div>
          <div className="text-3xl text-gray-800 text-center">
            INTERVIEW FEEDBACK MANAGEMENT SYSTEM
          </div>
        </div>
        <div className="flex flex-1 w-full items-center justify-center gap-10">
          <div className="hidden md:block lg:block">
            <img
              src="https://www.thetalentpool.co.in/wp-content/uploads/2024/09/interview-mgmt.webp"
              alt=""
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
