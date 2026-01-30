import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1280px]">
      {/* Left Sidebar - hidden on mobile */}
      <aside className="sticky top-0 hidden h-screen w-[68px] shrink-0 border-r border-border lg:block xl:w-[275px]">
        <Sidebar user={session.user} />
      </aside>

      {/* Main Content */}
      <main className="min-h-screen w-full max-w-[600px] flex-1 border-r border-border">
        {children}
      </main>

      {/* Right Sidebar - hidden on smaller screens */}
      <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 lg:block">
        <RightSidebar />
      </aside>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
