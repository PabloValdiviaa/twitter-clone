"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile.actions";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validators";
import type { ProfileWithStats } from "@/types";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditProfileDialogProps {
  profile: ProfileWithStats;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      image: profile.image || "",
      bannerImage: profile.bannerImage || "",
    },
  });

  const imageValue = form.watch("image");
  const bannerValue = form.watch("bannerImage");

  async function handleFileSelect(
    file: File,
    field: "image" | "bannerImage",
  ) {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 4MB");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    form.setValue(field, dataUrl, { shouldDirty: true });
  }

  async function onSubmit(values: UpdateProfileInput) {
    setIsPending(true);
    const result = await updateProfile(values);

    if (result.success) {
      toast.success("Perfil actualizado");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full font-bold">
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Banner */}
            <div className="relative h-[150px] bg-muted overflow-hidden">
              {bannerValue && (
                <img
                  src={bannerValue}
                  alt="Banner"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="rounded-full bg-black/60 p-2 text-white transition-opacity hover:opacity-80"
                >
                  <Camera className="h-5 w-5" />
                </button>
                {bannerValue && (
                  <button
                    type="button"
                    onClick={() => form.setValue("bannerImage", "", { shouldDirty: true })}
                    className="rounded-full bg-black/60 p-2 text-white transition-opacity hover:opacity-80"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, "bannerImage");
                  e.target.value = "";
                }}
              />
            </div>

            {/* Avatar */}
            <div className="relative -mt-[48px] ml-4 mb-4">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="group relative block rounded-full"
              >
                <UserAvatar
                  name={profile.name}
                  image={imageValue || undefined}
                  className="h-24 w-24 border-4 border-background text-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, "image");
                  e.target.value = "";
                }}
              />
            </div>

            <div className="space-y-4 px-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        rows={3}
                        maxLength={160}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio web</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full px-6 font-bold"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
