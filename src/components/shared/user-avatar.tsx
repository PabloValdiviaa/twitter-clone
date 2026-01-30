import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
    </Avatar>
  );
}
