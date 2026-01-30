"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/actions/follow.actions";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  username?: string | null;
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, username }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleFollow(userId),
    onMutate: () => {
      setIsFollowing((prev) => !prev);
    },
    onError: () => {
      setIsFollowing((prev) => !prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username || userId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (isFollowing) {
    return (
      <Button
        variant="outline"
        className="rounded-full font-bold min-w-[110px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => mutation.mutate()}
      >
        {isHovered ? "Dejar de seguir" : "Siguiendo"}
      </Button>
    );
  }

  return (
    <Button
      className="rounded-full font-bold min-w-[90px]"
      onClick={() => mutation.mutate()}
    >
      Seguir
    </Button>
  );
}
