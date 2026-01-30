import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Página no encontrada</h1>
      <p className="text-lg text-muted-foreground">
        La página que buscas no existe o ha sido movida.
      </p>
      <Button asChild className="mt-4 rounded-full">
        <Link href="/home">Ir al inicio</Link>
      </Button>
    </div>
  );
}
