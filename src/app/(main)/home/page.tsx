import { Header } from "@/components/layout/header";
import { ComposePost } from "@/components/feed/compose-post";
import { TimelineTabs } from "@/components/feed/timeline-tabs";

export default function HomePage() {
  return (
    <div>
      <Header title="Inicio" />
      <ComposePost />
      <TimelineTabs />
    </div>
  );
}
