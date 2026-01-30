"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useCurrentUser();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div>
      <Header title="Configuración" />
      <div className="space-y-6 p-4">
        {/* Theme */}
        <div>
          <h3 className="mb-4 text-lg font-bold">Apariencia</h3>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-muted-foreground">
                  Activar o desactivar el modo oscuro
                </p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </div>

        <Separator />

        {/* Profile */}
        <div>
          <h3 className="mb-4 text-lg font-bold">Cuenta</h3>
          {user && (
            <Link
              href={`/${(user as Record<string, unknown>).username || user.id}`}
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <User className="h-5 w-5" />
              <div>
                <p className="font-medium">Editar perfil</p>
                <p className="text-sm text-muted-foreground">
                  Actualiza tu nombre, biografía y otros detalles
                </p>
              </div>
            </Link>
          )}
        </div>

        <Separator />

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
