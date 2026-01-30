import { Header } from "@/components/layout/header";

export default function PostNotFound() {
  return (
    <div>
      <Header title="Publicación" showBackButton />
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold">Esta publicación no existe</h2>
        <p className="mt-2 text-muted-foreground">
          Puede que haya sido eliminada o el enlace sea incorrecto.
        </p>
      </div>
    </div>
  );
}
