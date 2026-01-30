import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Crear una cuenta</h1>
        <p className="text-muted-foreground">
          Ingresa tus datos para comenzar
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-primary underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
