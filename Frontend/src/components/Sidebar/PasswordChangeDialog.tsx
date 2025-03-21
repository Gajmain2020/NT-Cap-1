import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { changePassword } from "@/services/userService";

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
    await changePassword(passwords, setLoading, setOpen);
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
