import { CardContent } from "../ui/card";

export default function IntervieweeDetails() {
  return (
    <CardContent>
      <div className="border border-gray-300 p-3 rounded-lg shadow-md flex flex-col gap-3 items-center">
        <div className="font-semibold">Interviewee Details</div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full">
          <p>
            <i>Name : </i> Test Name
          </p>
          <p>
            <i>Email : </i> 123@example.com
          </p>
          <p>
            <i>Date : </i> 23-09-2025
          </p>
          <p>
            <i>Duration : </i> 180 min
          </p>
        </div>
      </div>
    </CardContent>
  );
}
