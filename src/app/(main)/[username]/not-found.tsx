import { Header } from "@/components/layout/header";

export default function ProfileNotFound() {
  return (
    <div>
      <Header title="Perfil" showBackButton />
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold">Esta cuenta no existe</h2>
        <p className="mt-2 text-muted-foreground">
          Intenta buscar otra.
        </p>
      </div>
    </div>
  );
}
