"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPost } from "@/actions/post.actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ComposePostProps {
  parentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

export function ComposePost({
  parentId,
  placeholder = "¡¿Qué está pasando?!",
  onSuccess,
}: ComposePostProps) {
  const { user } = useCurrentUser();
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const charCount = content.length;
  const isOverLimit = charCount > 280;
  const isEmpty = content.trim().length === 0;

  async function handleSubmit() {
    if (isEmpty || isOverLimit) return;

    setIsPending(true);
    const result = await createPost({ content: content.trim(), parentId });

    if (result.success) {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  if (!user) return null;

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex gap-3">
        <UserAvatar
          name={user.name}
          image={user.image}
          className="h-10 w-10"
        />
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none border-none bg-transparent p-0 text-xl placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {charCount > 0 && (
                <span
                  className={`text-sm ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {charCount}/280
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isEmpty || isOverLimit || isPending}
              className="rounded-full px-5 font-bold"
            >
              {parentId ? "Responder" : "Postear"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
