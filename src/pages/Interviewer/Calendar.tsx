import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DummyInterviewSchedule = [
  {
    intervieweeName: "Gajendra Sahu",
    intervieweeEmail: "gajendra@mail.com",
    resumeLink: "123",
    position: "123",
    interviewer: "Jone",
    schedule: "2025-02-26T23:44",
  },
  {
    intervieweeName: "test2",
    intervieweeEmail: "test2@gamil.com",
    resumeLink: "jhsjdh",
    position: "pos",
    interviewer: "testing2",
    schedule: "2025-03-20T23:40",
  },
  {
    intervieweeName: "jshd",
    intervieweeEmail: "jshd@mail.com",
    resumeLink: "hjsdj",
    position: "jshd",
    interviewer: "sjdh",
    schedule: "2025-03-20T23:41",
  },
  {
    intervieweeName: "kkhjsdj",
    intervieweeEmail: "jhsdjsjdh@mail.com",
    resumeLink: "jshdj",
    position: "sjdh@mail.com",
    interviewer: "123",
    schedule: "2025-03-20T23:43",
  },
];

export interface IInterview {
  intervieweeName: string;
  intervieweeEmail: string;
  resumeLink: string;
  position: string;
  interviewer: string;
  schedule: string;
}

export default function Calendar() {
  const [interviews, setInterviews] = useState(DummyInterviewSchedule);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate the date range for the calendar
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  // Organize interviews by date
  const interviewsByDate: Record<string, IInterview[]> = {};
  interviews.forEach((interview) => {
    const dateKey = format(new Date(interview.schedule), "yyyy-MM-dd");
    if (!interviewsByDate[dateKey]) interviewsByDate[dateKey] = [];
    interviewsByDate[dateKey].push(interview);
  });

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 min-h-screen gap-10">
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
                            {format(new Date(interview.schedule), "hh:mm a")}
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
