"use client";

import { BackButton } from "@/components/shared/back-button";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  subtitle?: string;
}

export function Header({ title, showBackButton, subtitle }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-[53px] items-center gap-4 px-4">
        {showBackButton && <BackButton />}
        <div>
          <h1 className="text-xl font-bold leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
