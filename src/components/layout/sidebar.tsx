"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Search,
  Bell,
  Bookmark,
  User as UserIcon,
  Settings,
  Feather,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUnreadCount } from "@/actions/notification.actions";
import { SidebarLink } from "./sidebar-link";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SidebarUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  image?: string | null;
};

export function Sidebar({ user }: { user: SidebarUser }) {
  const router = useRouter();

  const { data: unreadCount } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000,
  });

  const navLinks = [
    { href: "/home", icon: Home, label: "Inicio" },
    { href: "/explore", icon: Search, label: "Explorar" },
    { href: "/notifications", icon: Bell, label: "Notificaciones", badge: unreadCount },
    { href: "/bookmarks", icon: Bookmark, label: "Guardados" },
    { href: "/settings", icon: Settings, label: "Configuración" },
  ];

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col justify-between px-2 py-4">
      <div className="space-y-1">
        {/* Logo */}
        <Link
          href="/home"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-accent xl:w-auto xl:justify-start xl:px-3"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* Nav Links */}
        {navLinks.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}

        {/* Profile Link */}
        <SidebarLink
          href={`/${user.username || user.id}`}
          icon={UserIcon}
          label="Perfil"
        />

        {/* Post Button */}
        <Button
          className="mt-4 w-12 rounded-full xl:w-full"
          size="lg"
          asChild
        >
          <Link href="/home">
            <Feather className="h-5 w-5 xl:hidden" />
            <span className="hidden xl:inline">Postear</span>
          </Link>
        </Button>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="h-10 w-10"
            />
            <div className="hidden flex-1 text-left xl:block">
              <p className="text-sm font-semibold leading-tight truncate">
                {user.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                @{user.username || "user"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuItem asChild>
            <Link href={`/${user.username || user.id}`}>
              <UserIcon className="mr-2 h-4 w-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
