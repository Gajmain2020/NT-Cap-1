import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { passwordChangeSchema } from "@/utils/validationSchema";
import { toast } from "sonner";
import { ChangeUserPasswordApi } from "@/api/userApis";

function PasswordChangeDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      const checkSchema = passwordChangeSchema.safeParse(passwords);

      if (!checkSchema.success) {
        checkSchema.error.issues.forEach((err) => toast.error(err.message));
        return;
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        toast.error("New password and Confirm password must match.");
        return;
      }

      const response = await ChangeUserPasswordApi(passwords);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Password changed successfully!");
      setOpen(false);
    } catch (error) {
      console.log("hello world", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords((passwords) => ({
                ...passwords,
                oldPassword: e.target.value,
              }))
            }
          />
          <Input
            type="password"
            value={passwords.newPassword}
            placeholder="New Password"
            onChange={(e) =>
              setPasswords((passwords) => ({
                ...passwords,
                newPassword: e.target.value,
              }))
            }
          />
          <Input
            type="password"
            value={passwords.confirmPassword}
            placeholder="Re-enter New Password"
            onChange={(e) =>
              setPasswords((passwords) => ({
                ...passwords,
                confirmPassword: e.target.value,
              }))
            }
          />
          <Button disabled={loading} onClick={handlePasswordChange}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default PasswordChangeDialog;
