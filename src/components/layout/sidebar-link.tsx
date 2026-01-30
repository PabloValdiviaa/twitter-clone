"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function SidebarLink({ href, icon: Icon, label, badge }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-full p-3 text-xl transition-colors hover:bg-accent xl:pr-6",
        isActive && "font-bold",
      )}
    >
      <div className="relative">
        <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
        {badge && badge > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </div>
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
}
