import { interviewRescheduleFields } from "@/utils/constants";
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
              {interviewRescheduleFields.map(
                ({
                  label,
                  name,
                  type,
                }: {
                  label: string;
                  name: string;
                  type: string;
                }) => (
                  <div key={name} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <Input
                      type={type as React.HTMLInputTypeAttribute}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      value={
                        selectedInterview[
                          name as keyof ExtendedScheduledInterview
                        ]?.toString() || ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (selectedInterview) {
                          setSelectedInterview({
                            ...selectedInterview,
                            [name]: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                )
              )}
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
