import { notFound } from "next/navigation";
import { getPostWithThread } from "@/actions/post.actions";
import { Header } from "@/components/layout/header";
import { PostCard } from "@/components/feed/post-card";
import { ComposePost } from "@/components/feed/compose-post";
import { PostRepliesList } from "@/components/feed/post-replies-list";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const thread = await getPostWithThread(postId);

  if (!thread) {
    notFound();
  }

  const { post, parents } = thread;

  return (
    <div>
      <Header title="Post" showBackButton />

      {/* Parent chain */}
      {parents.map((parent) => (
        <PostCard key={parent.id} post={parent} />
      ))}

      {/* Main post */}
      <PostCard post={post} />

      {/* Reply composer */}
      <ComposePost parentId={post.id} placeholder="Post your reply" />

      {/* Replies */}
      <PostRepliesList postId={post.id} />
    </div>
  );
}
