"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/actions/like.actions";
import { toggleRepost } from "@/actions/repost.actions";
import { toggleBookmark } from "@/actions/bookmark.actions";
import { deletePost } from "@/actions/post.actions";
import { useOptimisticAction } from "@/hooks/use-optimistic-action";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import type { PostWithAuthor } from "@/types";

interface PostActionsProps {
  post: PostWithAuthor;
}

export function PostActions({ post }: PostActionsProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  const isOwnPost = user?.id === post.authorId;

  function requireAuth(): boolean {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }

  const likeMutation = useOptimisticAction({
    mutationFn: () => toggleLike(post.id),
    postId: post.id,
    updatePost: (p) => ({
      ...p,
      isLiked: !p.isLiked,
      _count: {
        ...p._count,
        likes: p.isLiked ? p._count.likes - 1 : p._count.likes + 1,
      },
    }),
  });

  const repostMutation = useOptimisticAction({
    mutationFn: () => toggleRepost(post.id),
    postId: post.id,
    updatePost: (p) => ({
      ...p,
      isReposted: !p.isReposted,
      _count: {
        ...p._count,
        reposts: p.isReposted ? p._count.reposts - 1 : p._count.reposts + 1,
      },
    }),
  });

  const bookmarkMutation = useOptimisticAction({
    mutationFn: () => toggleBookmark(post.id),
    postId: post.id,
    updatePost: (p) => ({
      ...p,
      isBookmarked: !p.isBookmarked,
    }),
  });

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    const result = await deletePost(post.id);
    if (result.success) {
      toast.success("Publicación eliminada");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="mt-2 flex max-w-md items-center justify-between">
      {/* Reply */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!requireAuth()) return;
          router.push(`/post/${post.id}`);
        }}
        className="group flex items-center gap-1 text-muted-foreground transition-colors hover:text-blue-500"
        aria-label="Responder"
      >
        <div className="rounded-full p-2 transition-colors group-hover:bg-blue-500/10">
          <MessageCircle className="h-[18px] w-[18px]" />
        </div>
        {post._count.replies > 0 && (
          <span className="text-xs">{post._count.replies}</span>
        )}
      </button>

      {/* Repost */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!requireAuth()) return;
          repostMutation.mutate();
        }}
        className={cn(
          "group flex items-center gap-1 text-muted-foreground transition-colors hover:text-green-500",
          post.isReposted && "text-green-500",
        )}
        aria-label="Repostear"
      >
        <div className="rounded-full p-2 transition-colors group-hover:bg-green-500/10">
          <Repeat2 className="h-[18px] w-[18px]" />
        </div>
        {post._count.reposts > 0 && (
          <span className="text-xs">{post._count.reposts}</span>
        )}
      </button>

      {/* Like */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!requireAuth()) return;
          likeMutation.mutate();
        }}
        className={cn(
          "group flex items-center gap-1 text-muted-foreground transition-colors hover:text-pink-500",
          post.isLiked && "text-pink-500",
        )}
        aria-label="Me gusta"
      >
        <div className="rounded-full p-2 transition-colors group-hover:bg-pink-500/10">
          <Heart
            className="h-[18px] w-[18px]"
            fill={post.isLiked ? "currentColor" : "none"}
          />
        </div>
        {post._count.likes > 0 && (
          <span className="text-xs">{post._count.likes}</span>
        )}
      </button>

      {/* Bookmark */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!requireAuth()) return;
          bookmarkMutation.mutate();
        }}
        className={cn(
          "group flex items-center text-muted-foreground transition-colors hover:text-blue-500",
          post.isBookmarked && "text-blue-500",
        )}
        aria-label="Guardar"
      >
        <div className="rounded-full p-2 transition-colors group-hover:bg-blue-500/10">
          <Bookmark
            className="h-[18px] w-[18px]"
            fill={post.isBookmarked ? "currentColor" : "none"}
          />
        </div>
      </button>

      {/* Share / Delete */}
      {isOwnPost ? (
        <button
          onClick={handleDelete}
          className="group flex items-center text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Eliminar"
        >
          <div className="rounded-full p-2 transition-colors group-hover:bg-destructive/10">
            <Trash2 className="h-[18px] w-[18px]" />
          </div>
        </button>
      ) : (
        <button
          className="group flex items-center text-muted-foreground transition-colors hover:text-blue-500"
          aria-label="Compartir"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(
              `${window.location.origin}/post/${post.id}`,
            );
            toast.success("Enlace copiado al portapapeles");
          }}
        >
          <div className="rounded-full p-2 transition-colors group-hover:bg-blue-500/10">
            <Share className="h-[18px] w-[18px]" />
          </div>
        </button>
      )}
    </div>
  );
}
