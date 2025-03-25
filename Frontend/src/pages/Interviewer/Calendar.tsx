import { GetAllInterviewsOfInterviewerAPI } from "@/api/interviewerApis";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExtendedScheduledInterview, IInterview } from "@/utils/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InterviewerCalendar() {
  const [interviews, setInterviews] = useState<ExtendedScheduledInterview[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAllInterviewerInterviews = async () => {
      try {
        const response = await GetAllInterviewsOfInterviewerAPI();
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        setInterviews(response.data);
      } catch (error) {
        console.log("Error occurred:", error);
        toast.error("Error occurred while fetching interviews.");
      }
    };

    fetchAllInterviewerInterviews();
  }, []);

  // Generate the date range for the calendar
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  // Organize interviews by date
  const interviewsByDate: Record<string, IInterview[]> = {};
  interviews.forEach((interview) => {
    const dateKey = format(new Date(interview.date), "yyyy-MM-dd");
    if (!interviewsByDate[dateKey]) interviewsByDate[dateKey] = [];
    interviewsByDate[dateKey].push(interview);
  });

  return (
    <div className="bg-gray-100 p-2 gap-10">
      <div className="bg-white shadow-lg rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Previous
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}

          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const interviewsOnDay = interviewsByDate[dateKey] || [];

            return (
              <Dialog key={dateKey}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => setSelectedDate(day)}
                    className={`h-20 p-2 border rounded-lg text-center text-sm cursor-pointer transition-all ${
                      isSameMonth(day, currentMonth)
                        ? "bg-gray-50 hover:bg-gray-200 hover:shadow"
                        : "bg-gray-200 opacity-50"
                    }`}
                  >
                    <div className="font-medium">{format(day, "d")}</div>

                    {/* Display up to 1 interview name */}
                    {interviewsOnDay.slice(0, 1).map((interview, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-700 rounded p-1 text-xs mt-1 truncate"
                      >
                        {interview.intervieweeName}
                      </div>
                    ))}

                    {/* Show if more interviews exist */}
                    {interviewsOnDay.length > 1 && (
                      <div className="text-xs text-blue-500 mt-1">
                        +{interviewsOnDay.length - 1} more
                      </div>
                    )}
                  </div>
                </DialogTrigger>

                {/* Interview Details Dialog */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Interviews on {format(day, "dd MMM yyyy")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {interviewsOnDay.length > 0 ? (
                      interviewsOnDay.map((interview, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg shadow-sm"
                        >
                          <p className="font-medium text-gray-700">
                            Name: {interview.intervieweeName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {"hello@mail.com"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Position: {interview.position}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(interview.date), "hh:mm a")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No interviews scheduled.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </div>
  );
}
