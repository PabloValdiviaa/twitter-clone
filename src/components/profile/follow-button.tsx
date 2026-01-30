"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/actions/follow.actions";
import { useCurrentUser } from "@/hooks/use-current-user";
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
  const router = useRouter();
  const { isAuthenticated } = useCurrentUser();

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

  function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    mutation.mutate();
  }

  if (isFollowing) {
    return (
      <Button
        variant="outline"
        className="rounded-full font-bold min-w-[110px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {isHovered ? "Dejar de seguir" : "Siguiendo"}
      </Button>
    );
  }

  return (
    <Button
      className="rounded-full font-bold min-w-[90px]"
      onClick={handleClick}
    >
      Seguir
    </Button>
  );
}
