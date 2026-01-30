import { requireSession } from "@/lib/auth-session";
import { Header } from "@/components/layout/header";
import { BookmarkList } from "@/components/feed/bookmark-list";

export default async function BookmarksPage() {
  await requireSession();

  return (
    <div>
      <Header title="Guardados" />
      <BookmarkList />
    </div>
  );
}
