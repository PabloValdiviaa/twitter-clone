# X Clone - Arquitectura y Estructura del Programa

## Documento de Diseño QA - Enero 2026

---

## 1. Stack Tecnologico

| Capa            | Tecnologia     | Version           | Funcion                                         |
| --------------- | -------------- | ----------------- | ----------------------------------------------- |
| Framework       | Next.js        | 15.x (App Router) | SSR, routing, Server Components, Server Actions |
| ORM             | Drizzle ORM    | 0.45.x stable     | Schema, queries, migraciones                    |
| Auth            | Better Auth    | 1.4.x             | Autenticacion, sesiones, OAuth                  |
| Base de datos   | PostgreSQL     | 16+               | Almacenamiento persistente                      |
| UI              | shadcn/ui      | 2.5.x (Radix)     | Componentes accesibles                          |
| Estilos         | Tailwind CSS   | v4                | Utilidades CSS                                  |
| Validacion      | Zod            | latest            | Schema validation                               |
| Estado servidor | TanStack Query | v5                | Cache, revalidacion, optimistic updates         |

---

## 2. Estructura de Directorios

```
twitter_clone/
├── src/
│   ├── app/                              # App Router - solo routing
│   │   ├── layout.tsx                    # Root layout (ThemeProvider, QueryProvider)
│   │   ├── page.tsx                      # Landing / redirect a /home
│   │   ├── globals.css                   # Variables CSS + temas
│   │   │
│   │   ├── (auth)/                       # Route group - autenticacion
│   │   │   ├── layout.tsx                # Layout centrado sin sidebar
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/                       # Route group - app principal
│   │   │   ├── layout.tsx                # Layout 3 columnas (sidebar + feed + aside)
│   │   │   ├── home/
│   │   │   │   └── page.tsx              # Timeline (For You / Following)
│   │   │   ├── explore/
│   │   │   │   └── page.tsx              # Busqueda + trending
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx              # Notificaciones (All / Mentions)
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx              # Lista de conversaciones
│   │   │   │   └── [conversationId]/
│   │   │   │       └── page.tsx          # Chat individual
│   │   │   ├── [username]/
│   │   │   │   ├── page.tsx              # Perfil (Posts tab)
│   │   │   │   ├── replies/
│   │   │   │   │   └── page.tsx          # Perfil (Replies tab)
│   │   │   │   ├── media/
│   │   │   │   │   └── page.tsx          # Perfil (Media tab)
│   │   │   │   ├── likes/
│   │   │   │   │   └── page.tsx          # Perfil (Likes tab)
│   │   │   │   └── followers/
│   │   │   │       └── page.tsx          # Lista de seguidores
│   │   │   ├── post/
│   │   │   │   └── [postId]/
│   │   │   │       └── page.tsx          # Detalle de post + hilo
│   │   │   ├── settings/
│   │   │   │   └── page.tsx              # Configuracion de usuario
│   │   │   └── bookmarks/
│   │   │       └── page.tsx              # Posts guardados
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── [...all]/
│   │               └── route.ts          # Better Auth catch-all handler
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui base (no modificar logica de negocio)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── input.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── command.tsx
│   │   │   ├── form.tsx
│   │   │   ├── switch.tsx
│   │   │   └── spinner.tsx
│   │   │
│   │   ├── layout/                       # Componentes de layout
│   │   │   ├── sidebar.tsx               # Sidebar izquierdo (navegacion)
│   │   │   ├── mobile-nav.tsx            # Navegacion inferior movil
│   │   │   ├── right-sidebar.tsx         # Sidebar derecho (trends, who to follow)
│   │   │   ├── header.tsx                # Header sticky por pagina
│   │   │   └── theme-toggle.tsx          # Switch dark/light mode
│   │   │
│   │   ├── feed/                         # Componentes del feed
│   │   │   ├── post-card.tsx             # Card de un post individual
│   │   │   ├── post-actions.tsx          # Barra de acciones (like, repost, reply, bookmark)
│   │   │   ├── post-list.tsx             # Lista infinita de posts
│   │   │   ├── compose-post.tsx          # Formulario de composicion
│   │   │   ├── compose-dialog.tsx        # Modal de composicion
│   │   │   └── timeline-tabs.tsx         # Tabs "For You" / "Following"
│   │   │
│   │   ├── profile/                      # Componentes de perfil
│   │   │   ├── profile-header.tsx        # Banner + avatar + bio + stats
│   │   │   ├── profile-tabs.tsx          # Tabs de navegacion del perfil
│   │   │   ├── edit-profile-dialog.tsx   # Modal editar perfil
│   │   │   └── follow-button.tsx         # Boton follow/unfollow
│   │   │
│   │   ├── notifications/               # Componentes de notificaciones
│   │   │   ├── notification-item.tsx     # Item individual
│   │   │   └── notification-list.tsx     # Lista de notificaciones
│   │   │
│   │   ├── search/                       # Componentes de busqueda
│   │   │   ├── search-bar.tsx            # Barra de busqueda
│   │   │   ├── trending-list.tsx         # Lista de tendencias
│   │   │   └── who-to-follow.tsx         # Sugerencias de usuarios
│   │   │
│   │   ├── shared/                       # Componentes compartidos
│   │   │   ├── user-avatar.tsx           # Avatar con link al perfil
│   │   │   ├── user-hover-card.tsx       # Preview de usuario al hover
│   │   │   ├── infinite-scroll.tsx       # Wrapper de scroll infinito
│   │   │   ├── image-upload.tsx          # Componente de subida de imagenes
│   │   │   └── back-button.tsx           # Boton de retroceso
│   │   │
│   │   └── providers/                    # Context providers
│   │       ├── theme-provider.tsx        # next-themes
│   │       └── query-provider.tsx        # TanStack Query
│   │
│   ├── lib/                              # Utilidades y configuracion
│   │   ├── auth.ts                       # Configuracion de Better Auth (server)
│   │   ├── auth-client.ts                # Cliente de Better Auth (client)
│   │   ├── db/
│   │   │   ├── index.ts                  # Instancia de Drizzle + export db
│   │   │   └── schema/
│   │   │       ├── index.ts              # Re-export de todos los schemas
│   │   │       ├── users.ts              # Tabla users + relations
│   │   │       ├── posts.ts              # Tabla posts + relations
│   │   │       ├── likes.ts              # Tabla likes
│   │   │       ├── reposts.ts            # Tabla reposts
│   │   │       ├── follows.ts            # Tabla follows
│   │   │       ├── bookmarks.ts          # Tabla bookmarks
│   │   │       ├── notifications.ts      # Tabla notifications
│   │   │       ├── media.ts              # Tabla media
│   │   │       └── auth.ts               # Tablas de Better Auth (user, session, account, verification)
│   │   ├── utils.ts                      # cn() + helpers generales
│   │   └── validators.ts                 # Schemas Zod compartidos
│   │
│   ├── actions/                          # Server Actions
│   │   ├── post.actions.ts               # createPost, deletePost, getTimeline
│   │   ├── like.actions.ts               # toggleLike
│   │   ├── repost.actions.ts             # toggleRepost
│   │   ├── follow.actions.ts             # toggleFollow
│   │   ├── bookmark.actions.ts           # toggleBookmark
│   │   ├── profile.actions.ts            # updateProfile, getProfile
│   │   ├── notification.actions.ts       # getNotifications, markAsRead
│   │   └── search.actions.ts             # searchPosts, searchUsers, getTrending
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── use-current-user.ts           # Hook para sesion actual
│   │   ├── use-infinite-posts.ts         # Hook TanStack Query para feed infinito
│   │   └── use-optimistic-action.ts      # Hook para optimistic updates
│   │
│   └── types/                            # Tipos TypeScript
│       └── index.ts                      # Tipos derivados del schema + custom

│
├── drizzle/                              # Migraciones generadas por drizzle-kit
│   └── XXXX_migration.sql
│
├── public/                               # Assets estaticos
│   └── placeholder-avatar.png
│
├── drizzle.config.ts                     # Configuracion de Drizzle Kit
├── next.config.ts                        # Configuracion de Next.js
├── components.json                       # Configuracion de shadcn/ui
├── tailwind.config.ts                    # Configuracion de Tailwind (si v3)
├── tsconfig.json
├── package.json
├── .env.local                            # Variables de entorno
└── .gitignore
```

---

## 3. Schema de Base de Datos (Drizzle + PostgreSQL)

### 3.1 Diagrama Entidad-Relacion

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users      │     │    posts     │     │    media     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ authorId (FK)│     │ id (PK)      │
│ name         │     │ id (PK)      │◄────│ postId (FK)  │
│ username     │     │ content      │     │ url          │
│ email        │     │ parentId(FK) │──┐  │ type         │
│ bio          │     │ createdAt    │  │  │ createdAt    │
│ image        │     │ updatedAt    │  │  └──────────────┘
│ bannerImage  │     └──────────────┘  │
│ location     │           │           └──► (self-reference para replies)
│ website      │           │
│ createdAt    │     ┌─────┴────────┐
└──────┬───────┘     │              │
       │       ┌─────┴─────┐  ┌────┴──────┐
       │       │   likes   │  │  reposts  │
       │       ├───────────┤  ├───────────┤
       │       │ userId(FK)│  │ userId(FK)│
       │       │ postId(FK)│  │ postId(FK)│
       │       │ createdAt │  │ createdAt │
       │       └───────────┘  └───────────┘
       │
  ┌────┴──────────┐     ┌────────────────┐
  │   follows     │     │  bookmarks     │
  ├───────────────┤     ├────────────────┤
  │ followerId(FK)│     │ userId (FK)    │
  │ followingId(FK)     │ postId (FK)    │
  │ createdAt     │     │ createdAt      │
  └───────────────┘     └────────────────┘

  ┌───────────────────┐
  │  notifications    │
  ├───────────────────┤
  │ id (PK)           │
  │ recipientId (FK)  │
  │ senderId (FK)     │
  │ type              │
  │ postId (FK, null) │
  │ isRead            │
  │ createdAt         │
  └───────────────────┘

  Tablas de Better Auth (auto-generadas):
  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │ user   │  │ session  │  │ account  │  │ verification │
  └────────┘  └──────────┘  └──────────┘  └──────────────┘
```

### 3.2 Definiciones Drizzle

```typescript
// src/lib/db/schema/users.ts
import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Better Auth genera el ID
  name: text("name").notNull(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  bannerImage: text("banner_image"),
  bio: varchar("bio", { length: 160 }),
  location: varchar("location", { length: 100 }),
  website: varchar("website", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// src/lib/db/schema/posts.ts
export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: varchar("content", { length: 280 }).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: text("parent_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// src/lib/db/schema/likes.ts
export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.postId] }),
  }),
);

// src/lib/db/schema/follows.ts
export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  }),
);

// src/lib/db/schema/reposts.ts
export const reposts = pgTable(
  "reposts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.postId] }),
  }),
);

// src/lib/db/schema/bookmarks.ts
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.postId] }),
  }),
);

// src/lib/db/schema/notifications.ts
export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  recipientId: text("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // 'like' | 'repost' | 'reply' | 'follow' | 'mention'
  postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// src/lib/db/schema/media.ts
export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'image' | 'gif' | 'video'
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3.3 Relaciones Drizzle

```typescript
// src/lib/db/schema/relations.ts
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  reposts: many(reposts),
  bookmarks: many(bookmarks),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
  notificationsReceived: many(notifications, { relationName: "recipient" }),
  notificationsSent: many(notifications, { relationName: "sender" }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "replies",
  }),
  replies: many(posts, { relationName: "replies" }),
  likes: many(likes),
  reposts: many(reposts),
  bookmarks: many(bookmarks),
  media: many(media),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));
```

---

## 4. Configuracion de Better Auth

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias
    updateAge: 60 * 60 * 24, // refresh cada 24h
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutos
    },
  },
  plugins: [nextCookies()],
});

// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

### Proteccion de Rutas (Defensa en Profundidad)

```typescript
// middleware.ts - Capa 1: Redirect optimista (NO valida sesion)
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home",
    "/notifications",
    "/messages/:path*",
    "/settings",
    "/bookmarks",
  ],
};

// Capa 2: Validacion real en Server Components
// app/(main)/home/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");
  // ...render page
}

// Capa 3: Validacion en Server Actions
// src/actions/post.actions.ts
("use server");
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  // ...crear post
}
```

---

## 5. Layout UI - Sistema de 3 Columnas

```
┌─────────────────────────────────────────────────────────┐
│                    Viewport                             │
│  ┌──────────┬─────────────────────┬──────────────────┐  │
│  │  Sidebar │    Main Feed        │  Right Sidebar   │  │
│  │  ~275px  │    ~600px           │  ~350px          │  │
│  │          │                     │                  │  │
│  │  Logo    │  ┌───────────────┐  │  ┌────────────┐  │  │
│  │  Home    │  │ Header + Tabs │  │  │ Search Bar │  │  │
│  │  Explore │  ├───────────────┤  │  ├────────────┤  │  │
│  │  Notif.  │  │ Compose Post  │  │  │ Trending   │  │  │
│  │  Messages│  ├───────────────┤  │  │ Topics     │  │  │
│  │  Bookm.  │  │ Post Card     │  │  ├────────────┤  │  │
│  │  Profile │  │ Post Card     │  │  │ Who to     │  │  │
│  │  More    │  │ Post Card     │  │  │ Follow     │  │  │
│  │          │  │ Post Card     │  │  │            │  │  │
│  │          │  │ ... infinite  │  │  ├────────────┤  │  │
│  │ [Post]   │  │    scroll     │  │  │ Footer     │  │  │
│  │          │  │               │  │  │ links      │  │  │
│  │ @user    │  └───────────────┘  │  └────────────┘  │  │
│  └──────────┴─────────────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────┘

Responsive:
- Desktop (>1280px): 3 columnas completas
- Tablet (1024-1280px): Sidebar iconos + Feed, sin right sidebar
- Mobile (<1024px): Solo Feed + bottom nav bar
```

---

## 6. Flujos de Datos Criticos

### 6.1 Crear un Post (Server Action)

```
Usuario escribe texto
  → Submit form (client)
  → Server Action: createPost()
    → Validar sesion (auth.api.getSession)
    → Validar input (Zod schema)
    → Insertar en tabla posts (Drizzle)
    → Si tiene media, insertar en tabla media
    → Si es reply, insertar notificacion al autor del post padre
    → Si tiene @mentions, insertar notificaciones
    → revalidatePath("/home")
  → Optimistic update en cliente (TanStack Query)
```

### 6.2 Timeline (Feed)

```
Usuario carga /home
  → Server Component renderiza shell
  → Client Component con useInfiniteQuery
    → GET /api o Server Action: getTimeline(cursor)
      → Validar sesion
      → Query: posts de usuarios que sigo, ordenados por createdAt DESC
      → JOIN con users, likes, reposts, media
      → Cursor-based pagination (createdAt < cursor, LIMIT 20)
    → Render PostCard por cada resultado
    → IntersectionObserver dispara fetchNextPage
```

### 6.3 Toggle Like (Optimistic Update)

```
Usuario hace click en boton Like
  → Optimistic update: incrementar contador, cambiar icono
  → Server Action: toggleLike(postId)
    → Validar sesion
    → Check si ya existe like
      → Si existe: DELETE FROM likes
      → Si no: INSERT INTO likes + INSERT notificacion
    → Si falla: rollback optimistic update
```

### 6.4 Follow/Unfollow

```
Usuario hace click en Follow
  → Optimistic update: cambiar boton a "Following"
  → Server Action: toggleFollow(targetUserId)
    → Validar sesion
    → Verificar que no se siga a si mismo
    → Check si ya sigue
      → Si sigue: DELETE FROM follows
      → Si no: INSERT INTO follows + INSERT notificacion
    → revalidatePath(`/${username}`)
```

---

## 7. Variables de Entorno

```env
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/twitter_clone
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Media Storage (opcional - Cloudinary)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 8. Paginas y Funcionalidades

| Ruta                    | Funcionalidad                            | Auth Requerida |
| ----------------------- | ---------------------------------------- | -------------- |
| `/login`                | Login con email/password + OAuth         | No             |
| `/register`             | Registro con email/password + OAuth      | No             |
| `/home`                 | Timeline con tabs For You / Following    | Si             |
| `/explore`              | Busqueda + trending topics               | Si             |
| `/notifications`        | Lista de notificaciones (All / Mentions) | Si             |
| `/messages`             | Lista de conversaciones DM               | Si             |
| `/messages/[id]`        | Chat individual                          | Si             |
| `/[username]`           | Perfil publico con tabs                  | Parcial        |
| `/[username]/followers` | Lista de seguidores                      | Si             |
| `/post/[postId]`        | Detalle de post + hilo de replies        | Parcial        |
| `/settings`             | Configuracion de cuenta                  | Si             |
| `/bookmarks`            | Posts guardados                          | Si             |

---

## 9. Plan de QA - Casos de Test Criticos

### 9.1 Autenticacion

- [ ] Registro con email/password crea usuario en DB
- [ ] Login con credenciales correctas establece sesion
- [ ] Login con credenciales incorrectas muestra error
- [ ] OAuth con Google redirige y crea usuario
- [ ] OAuth con GitHub redirige y crea usuario
- [ ] Logout destruye la sesion
- [ ] Rutas protegidas redirigen a `/login` sin sesion
- [ ] Server Actions rechazan requests sin sesion valida
- [ ] Cookie de sesion tiene httpOnly, secure, sameSite

### 9.2 Posts

- [ ] Crear post con texto valido (1-280 chars)
- [ ] Rechazar post vacio
- [ ] Rechazar post que excede 280 caracteres
- [ ] Post se muestra en timeline del autor
- [ ] Post se muestra en timeline de seguidores
- [ ] Reply se vincula correctamente al post padre
- [ ] Eliminar post solo permitido al autor
- [ ] Eliminar post elimina en cascada likes, reposts, bookmarks

### 9.3 Timeline

- [ ] Timeline muestra posts de usuarios seguidos
- [ ] Timeline ordena por fecha descendente
- [ ] Paginacion cursor-based carga mas posts al scroll
- [ ] Posts propios aparecen en el timeline
- [ ] Posts de usuarios no seguidos NO aparecen en Following tab

### 9.4 Interacciones

- [ ] Like incrementa contador y cambia icono
- [ ] Unlike decrementa contador y revierte icono
- [ ] No se puede dar like al mismo post dos veces
- [ ] Repost incrementa contador
- [ ] No se puede repostear el mismo post dos veces
- [ ] Bookmark guarda post en /bookmarks
- [ ] Follow incrementa contadores en ambos perfiles
- [ ] No se puede seguir a uno mismo

### 9.5 Perfil

- [ ] Perfil muestra informacion correcta del usuario
- [ ] Tabs filtran posts correctamente (Posts, Replies, Media, Likes)
- [ ] Editar perfil actualiza nombre, bio, imagen, banner
- [ ] Contadores de followers/following son precisos

### 9.6 Notificaciones

- [ ] Like genera notificacion al autor del post
- [ ] Reply genera notificacion al autor del post padre
- [ ] Repost genera notificacion al autor del post
- [ ] Follow genera notificacion al usuario seguido
- [ ] Mention (@username) genera notificacion
- [ ] No se genera notificacion a uno mismo
- [ ] Marcar notificacion como leida funciona

### 9.7 Busqueda

- [ ] Busqueda por texto encuentra posts relevantes
- [ ] Busqueda por @username encuentra usuarios
- [ ] Trending topics muestra hashtags populares

### 9.8 Responsive

- [ ] Layout 3 columnas en desktop (>1280px)
- [ ] Sidebar colapsa a iconos en tablet
- [ ] Right sidebar se oculta en tablet
- [ ] Bottom nav aparece en mobile
- [ ] Compose dialog funciona en mobile

### 9.9 Dark Mode

- [ ] Toggle cambia entre light/dark
- [ ] Preferencia se persiste en localStorage
- [ ] Respeta preferencia del sistema por defecto
- [ ] No hay flash de tema incorrecto al cargar (suppressHydrationWarning)

---

## 10. Fuentes Citadas

### Next.js 15

- [Next.js 15 Release Blog](https://nextjs.org/blog/next-15) - App Router, React 19, caching defaults
- [Next.js Project Structure Docs](https://nextjs.org/docs/app/getting-started/project-structure) - Convenciones de archivos
- [Next.js Upgrading to v15](https://nextjs.org/docs/app/guides/upgrading/version-15) - Breaking changes (async APIs, caching)
- [Next.js 15.5 Blog](https://nextjs.org/blog/next-15-5) - Turbopack build beta, typed routes

### Drizzle ORM

- [Drizzle Get Started PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) - Configuracion con pg/postgres.js
- [Drizzle SQL Schema Declaration](https://orm.drizzle.team/docs/sql-schema-declaration) - Definicion de tablas
- [Drizzle Relational Query Builder](https://orm.drizzle.team/docs/rqb) - API de relaciones v1
- [Drizzle Migrations Overview](https://orm.drizzle.team/docs/migrations) - Estrategias generate/push/pull
- [Drizzle Kit Overview](https://orm.drizzle.team/docs/kit-overview) - CLI para migraciones

### Better Auth

- [Better Auth Installation](https://www.better-auth.com/docs/installation) - Setup basico
- [Better Auth Next.js Integration](https://www.better-auth.com/docs/integrations/next) - App Router, nextCookies plugin
- [Better Auth Session Management](https://www.better-auth.com/docs/concepts/session-management) - Cookies, cache, configuracion
- [Better Auth Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle) - Integracion con Drizzle ORM
- [Better Auth OAuth Docs](https://www.better-auth.com/docs/concepts/oauth) - Social providers

### shadcn/ui

- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) - Setup con Next.js
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) - CSS variables, OKLCH
- [shadcn/ui Dark Mode Next.js](https://ui.shadcn.com/docs/dark-mode/next) - next-themes integration
- [shadcn/ui Components](https://ui.shadcn.com/docs/components) - Catalogo de 76+ componentes

### Arquitectura Twitter/X

- [GeeksforGeeks - Twitter Database Design](https://www.geeksforgeeks.org/dbms/how-to-design-a-database-for-twitter/) - Schema SQL de referencia
- [System Design Handbook - Design Twitter](https://www.systemdesignhandbook.com/guides/design-twitter-system-design/) - Fan-out model, timeline architecture
- [X Help Center - Notifications](https://help.x.com/en/managing-your-account/understanding-the-notifications-timeline) - Tipos y filtros de notificaciones
- [X Help Center - Trending FAQs](https://help.x.com/en/using-x/x-trending-faqs) - Algoritmo de trending
- [X Developer Platform - Media Upload](https://developer.x.com/en/docs/x-api/v1/media/upload-media/api-reference/post-media-upload) - API de subida de media
