import { ExtendedScheduledInterview } from "@/utils/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

function EditDialog({
  selectedInterview,
  setSelectedInterview,
  loading,
  handleReschedule,
}: {
  selectedInterview: ExtendedScheduledInterview | null;
  setSelectedInterview: (args: ExtendedScheduledInterview | null) => void;
  loading: boolean;
  handleReschedule: () => void;
}) {
  return (
    <>
      {selectedInterview && (
        <Dialog
          open={selectedInterview !== null}
          onOpenChange={() => setSelectedInterview(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Scheduled Interview</DialogTitle>
            </DialogHeader>

            {/* MAIN EDIT FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Interviewer Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewer Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter interviewer name"
                  value={selectedInterview.interviewerName}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      interviewerName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewer Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewer Email *
                </label>
                <Input
                  type="email"
                  placeholder="Enter interviewer email"
                  value={selectedInterview.interviewerEmail}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      interviewerEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewee Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewee Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter interviewee name"
                  value={selectedInterview.intervieweeName}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      intervieweeName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Interviewee Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interviewee Email *
                </label>
                <Input
                  type="email"
                  placeholder="Enter interviewee email"
                  value={selectedInterview.intervieweeEmail}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      intervieweeEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* Resume Link */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Resume Link
                </label>
                <Input
                  type="text"
                  placeholder="Enter resume link"
                  value={selectedInterview.resumeLink}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      resumeLink: e.target.value,
                    })
                  }
                />
              </div>

              {/* Meet Link */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Meet Link
                </label>
                <Input
                  type="text"
                  placeholder="Enter meet link"
                  value={selectedInterview.meetLink}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      meetLink: e.target.value,
                    })
                  }
                />
              </div>

              {/* Position */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Position *
                </label>
                <Input
                  type="text"
                  placeholder="Enter position"
                  value={selectedInterview.position}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      position: e.target.value,
                    })
                  }
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Interview Date *
                </label>
                <Input
                  type="date"
                  value={selectedInterview.date}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              {/* Start Time */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={selectedInterview.startTime}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* End Time */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={selectedInterview.endTime}
                  onChange={(e) =>
                    setSelectedInterview({
                      ...selectedInterview,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => setSelectedInterview(null)}
              >
                Cancel
              </Button>
              <Button disabled={loading} onClick={handleReschedule}>
                {loading ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export default EditDialog;
