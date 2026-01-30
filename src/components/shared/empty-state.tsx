import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-muted-foreground" />}
      <h3 className="text-xl font-bold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
