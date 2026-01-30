import { requireSession } from "@/lib/auth-session";
import { NotificationsContent } from "@/components/notifications/notifications-content";

export default async function NotificationsPage() {
  await requireSession();

  return <NotificationsContent />;
}
