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
  //   isSameDay,
  isSameMonth,
} from "date-fns";

export default function CalendarView({
  interviews,
}: {
  interviews: IInterview[];
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
          return (
            <div
              key={dateKey}
              className={`p-2 border rounded-lg text-center text-sm ${
                isSameMonth(day, currentMonth)
                  ? "bg-gray-50"
                  : "bg-gray-200 opacity-50"
              }`}
            >
              <div className="font-medium">{format(day, "d")}</div>
              {interviewsByDate[dateKey] && (
                <div className="mt-1">
                  {interviewsByDate[dateKey].map((interview, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-700 rounded p-1 text-xs mt-1"
                    >
                      {interview.intervieweeName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
