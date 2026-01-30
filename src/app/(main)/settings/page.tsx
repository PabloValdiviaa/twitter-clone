import { requireSession } from "@/lib/auth-session";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  await requireSession();

  return <SettingsContent />;
}
