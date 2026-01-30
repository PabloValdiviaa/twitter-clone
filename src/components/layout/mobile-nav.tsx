"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const allLinks = [
  { href: "/home", icon: Home },
  { href: "/explore", icon: Search },
  { href: "/notifications", icon: Bell },
  { href: "/bookmarks", icon: Bookmark },
];

const publicLinks = [
  { href: "/home", icon: Home },
  { href: "/explore", icon: Search },
];

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const mobileLinks = isAuthenticated ? allLinks : publicLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center justify-around">
        {mobileLinks.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 items-center justify-center py-3",
                "transition-colors hover:bg-accent",
              )}
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
