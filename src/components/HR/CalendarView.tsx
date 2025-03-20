import { useState } from "react";
import { IInterview } from "@/utils/types";
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

export default function CalendarView({
  interviews,
}: {
  interviews: IInterview[];
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startCalendar = startOfWeek(startMonth);
  const endCalendar = endOfWeek(endMonth);
  const days = eachDayOfInterval({ start: startCalendar, end: endCalendar });

  const interviewsByDate = interviews.reduce((acc, interview) => {
    const interviewDate = new Date(interview.schedule);
    const dateKey = format(interviewDate, "yyyy-MM-dd");

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(interview);
    return acc;
  }, {} as Record<string, IInterview[]>);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ← Previous
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next →
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
                      ? "bg-gray-50 hover:bg-gray-200 hover:shadow hover:shadow-slate-300"
                      : "bg-gray-200 opacity-50"
                  }`}
                >
                  <div className="font-medium">{format(day, "d")}</div>

                  {/* Show up to 2 interviews inside the calendar */}
                  {interviewsOnDay.slice(0, 1).map((interview, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-700 rounded p-1 text-xs mt-1 truncate"
                    >
                      {interview.intervieweeName}
                    </div>
                  ))}

                  {/* Show "More..." if there are additional interviews */}
                  {interviewsOnDay.length > 2 && (
                    <div className="text-xs text-blue-500 mt-1">
                      +{interviewsOnDay.length - 1} more
                    </div>
                  )}
                </div>
              </DialogTrigger>

              {/* Modal Content */}
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
                          Pos: {interview.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          Interviewer: {interview.interviewer}
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
  );
}
