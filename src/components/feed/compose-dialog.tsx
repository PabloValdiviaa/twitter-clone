"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComposePost } from "./compose-post";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
}

export function ComposeDialog({
  open,
  onOpenChange,
  parentId,
}: ComposeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] translate-y-0 sm:max-w-[600px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Crear publicación</DialogTitle>
        </DialogHeader>
        <ComposePost
          parentId={parentId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
