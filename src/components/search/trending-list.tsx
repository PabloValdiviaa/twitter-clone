"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrending } from "@/actions/search.actions";
import Link from "next/link";

export function TrendingList() {
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(),
    staleTime: 5 * 60 * 1000,
  });

  if (!trending || trending.length === 0) {
    return (
      <div className="rounded-2xl bg-muted p-4">
        <h2 className="text-xl font-bold">Qué está pasando</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No hay temas en tendencia ahora mismo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-muted">
      <h2 className="px-4 pt-4 text-xl font-bold">Qué está pasando</h2>
      {trending.map((item, i) => (
        <Link
          key={i}
          href={`/explore?q=${encodeURIComponent(item.topic)}`}
          className="block px-4 py-3 transition-colors hover:bg-accent/50"
        >
          <p className="text-sm text-muted-foreground">Tendencia</p>
          <p className="font-bold">{item.topic}</p>
          <p className="text-sm text-muted-foreground">
            {item.count} publicaciones
          </p>
        </Link>
      ))}
    </div>
  );
}
