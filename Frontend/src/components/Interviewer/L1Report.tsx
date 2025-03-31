import { Dispatch, SetStateAction } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function L1Report({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>L1 Feedback</DialogTitle>
        </DialogHeader>
        <p>This is l1 feedback</p>
      </DialogContent>
    </Dialog>
  );
}
