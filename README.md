# Inventory App

A mobile inventory management app built for the **Full Stack Mobile Developer Assessment (Expo + Supabase)**. Lets you list, create, edit, and delete inventory items — each with a photo uploaded to Supabase Storage.

## Tech Stack

- **Expo React Native** with **Expo Router** (file-based navigation)
- **TypeScript**
- **Supabase** — Postgres for data, Storage for images
- **TanStack Query** (React Query) — fetching, caching, and mutations
- **Inter** font family (Regular / Medium / Bold)

Authentication is intentionally not implemented, per the assessment spec.

## Features

- Inventory list with image, name, quantity, and price
- Search by name/description, filter (All / In Stock / Low Stock), and sort (Newest / Name / Price / Quantity)
- Create an item with a required photo, uploaded to Supabase Storage
- Edit an item, including replacing its photo
- Delete an item with a custom confirmation dialog — also removes its image from Storage
- Loading, error, and empty states throughout
- Responsive layout (single column on phones, grid on tablets)

## Folder Structure

```
inventory-app/
├── app/                                # Expo Router screens
│   ├── _layout.tsx                     # Root layout: font loading, splash screen, Stack navigator
│   ├── index.tsx                       # Inventory list screen (search, filter, sort, delete)
│   ├── +not-found.tsx                  # Fallback screen for unmatched routes
│   └── item/
│       ├── create.tsx                  # Create item screen
│       └── [id].tsx                    # Item detail / edit screen
│
├── src/
│   ├── api/
│   │   ├── supabaseClient.ts           # Supabase client instance
│   │   ├── inventory.ts                # CRUD functions (fetch, create, update, delete)
│   │   └── storage.ts                  # Image upload/replace/delete helpers (Supabase Storage)
│   │
│   ├── hooks/                          # TanStack Query hooks — one per operation
│   │   ├── useInventoryList.ts         # useQuery — fetch all items
│   │   ├── useInventoryItem.ts         # useQuery — fetch a single item
│   │   ├── useCreateInventoryItem.ts   # useMutation — create + invalidate list
│   │   ├── useUpdateInventoryItem.ts   # useMutation — update + invalidate list/item
│   │   └── useDeleteInventoryItem.ts   # useMutation — delete + invalidate list
│   │
│   ├── components/
│   │   ├── ui/                         # Generic, reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx                # Text wrapper applying the default Inter font on native
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── FilterChip.tsx          # Toggleable pill used for filter/sort controls
│   │   │   └── AlertDialog.tsx         # Custom confirm/error modal (replaces native Alert)
│   │   │
│   │   ├── inventory/                  # Feature-specific components
│   │   │   ├── InventoryCard.tsx       # Single row in the list (image, name, qty, price, delete)
│   │   │   ├── InventoryList.tsx       # FlatList + search/filter/sort logic + empty states
│   │   │   ├── InventoryForm.tsx       # Shared form for create + edit
│   │   │   └── ImagePickerField.tsx    # Image preview + picker trigger
│   │   │
│   │   └── layout/
│   │       └── ScreenContainer.tsx     # SafeAreaView + KeyboardAvoidingView wrapper
│   │
│   ├── types/
│   │   ├── inventory.ts                # InventoryItem, InventoryItemInput, LocalImage
│   │   └── supabase.ts                 # Typed Supabase table schema
│   │
│   ├── lib/
│   │   ├── theme.ts                    # fonts, colors, spacing, radius — single source of truth
│   │   ├── queryClient.ts              # TanStack Query client config
│   │   └── constants.ts                # Table name, storage bucket, query keys
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── validation.ts               # Form validation (name, description, quantity, price, image)
│   │   ├── imageHelpers.ts             # Image picking from library/camera
│   │   └── responsive.ts               # Tablet breakpoint, grid columns, adaptive padding
│   │
│   └── config/
│       └── env.ts                      # Typed access to EXPO_PUBLIC_ env vars
│
├── assets/
│   └── fonts/                          # Inter-Regular / Inter-Medium / Inter-Bold (.ttf, add yourself)
│
├── supabase/
│   └── schema.sql                      # Table definition + Storage bucket/policy setup
│
├── global.css                          # Global font rule (web only — see Notes below)
├── .env.example
├── .env                                # Not committed — copy from .env.example
├── app.json                            # Expo config
├── eas.json                            # EAS Build profiles (includes `preview` → APK)
├── babel.config.js
├── tsconfig.json                       # Path alias: "@/*" → "src/*"
└── package.json
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`. This creates the `inventory_items` table.
3. Go to **Storage** and create a new **public** bucket named `inventory-images`.
   - If Storage has RLS enabled and uploads fail, run the storage policy statements at the bottom of `supabase/schema.sql`.

### 3. Add font files

The app loads Inter at startup (`app/_layout.tsx`). Download these three weights from [Google Fonts](https://fonts.google.com/specimen/Inter) and place them in `assets/fonts/`:

```
assets/fonts/Inter_18pt-Regular.ttf
assets/fonts/Inter_18pt-Medium.ttf
assets/fonts/Inter_18pt-Bold.ttf
```

The app will fail to load (blank splash screen) if these are missing, since `_layout.tsx` blocks rendering until fonts resolve.

### 4. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase project values (found in **Project Settings → API**):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app at runtime, per Expo's convention. `src/config/env.ts` throws at startup if either is missing.

### 5. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for an Android emulator / `i` for iOS simulator.

## Build Instructions (APK)

This project uses EAS Build to produce an installable APK, via the `preview` profile already configured in `eas.json`.

1. Install the EAS CLI (if you don't have it):
   ```bash
   npm install -g eas-cli
   ```
2. Log in:
   ```bash
   eas login
   ```
3. Configure the project (first time only):
   ```bash
   eas build:configure
   ```
4. Build the APK:
   ```bash
   eas build --platform android --profile preview
   ```
5. Download the `.apk` from the link EAS prints, or from your [expo.dev](https://expo.dev) dashboard.

## Notes on Implementation

- **Image lifecycle**: uploads always happen before any database write (`src/api/inventory.ts`), and old images are only deleted after a successful replace/delete — so a failed request never leaves an item pointing at a missing image.
- **Cache invalidation**: every mutation invalidates the relevant TanStack Query keys (`src/lib/constants.ts` → `QUERY_KEYS`), so the list and detail screens stay in sync automatically.
- **Shared form**: `InventoryForm.tsx` is used by both the create and edit screens — same validation, same layout, different submit handler.
- **`global.css`** only affects the web build (`expo start --web`); React Native has no CSS cascade, so native font defaults are applied via the `Text` wrapper in `src/components/ui/Text.tsx` instead.
