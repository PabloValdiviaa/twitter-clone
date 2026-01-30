import { Header } from "@/components/layout/header";
import { BookmarkList } from "@/components/feed/bookmark-list";

export default function BookmarksPage() {
  return (
    <div>
      <Header title="Guardados" />
      <BookmarkList />
    </div>
  );
}
