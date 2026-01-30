import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(280, "Post must be at most 280 characters"),
  parentId: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),
  website: z
    .string()
    .max(200, "Website must be at most 200 characters")
    .optional(),
  image: z.string().optional(),
  bannerImage: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
