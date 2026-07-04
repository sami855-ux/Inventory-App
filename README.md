# Inventory App

A mobile inventory management app built for the **Full Stack Mobile Developer Assessment (Expo + Supabase)**. Lets you list, create, edit, and delete inventory items, each with a photo uploaded to Supabase Storage.

## Tech Stack

- **Expo React Native** with **Expo Router** (file-based navigation)
- **TypeScript**
- **Supabase** — Postgres for data, Storage for images
- **TanStack Query** (React Query) — fetching, caching, and mutations
- **Inter** font family (Regular / Medium / Bold)

## Features

- Inventory list with image, name, quantity, category and price
- Responsive layout (list and grid)
- Search by name and description
- Filter items (All / In Stock / Low Stock)
- Sort items (Newest / Name / Price / Quantity)
- Create items with required image upload
- Images uploaded and stored in Supabase Storage
- Edit items including replacing images
- Delete items with custom confirmation dialog
- Soft delete implementation for safer data handling
- Lazy loading for images
- Infinite scrolling / pagination for large datasets
- React Query caching for optimized data fetching
- Loading states (skeletons/spinners)
- Error handling with retry support
- Empty state UI when no data exists

## Folder Structure

```
inventory-app/
├── app/                                # Expo Router screens
│   ├── _layout.tsx                     # Root layout: font loading, splash screen, Stack navigator
│   ├── index.tsx                       # Inventory list screen (search, filter, sort, delete)
│   ├── +not-found.tsx                  # Fallback screen for unmatched routes
│   └── item/
│       ├── create                
|          └──index.tsx                 # Create item screen
│       └── [id].tsx                    # Item detail / edit screen
│
├── src/
│   ├── api/
│   │   ├── supabaseClient.ts           # Supabase client instance
│   │   ├── inventory.ts                # CRUD functions (fetch, create, update, delete)
|   |   ├── constant.ts
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
|   |   |   ├── FilterSortModal.tsx
|   |   |   ├── ImageUploader.tsx
|   |   |   ├── InventoryGrid.tsx
|   |   |   ├── InventoryGridItem.tsx
|   |   |   ├── InvenetoryListSkeleton.tsx
│   │   │   └── ImagePickerField.tsx    # Image preview + picker trigger
│   │   │
│   │   └── layout/
│   │       └── ScreenContainer.tsx     # SafeAreaView + KeyboardAvoidingView wrapper
│   │
│   ├── types/
│   │   ├── inventory.ts                # InventoryItem, InventoryItemInput, LocalImage
│   │   └── inventory.schema.ts
│   │
│   ├── lib/
│   │   ├── theme.ts                    # fonts, colors, spacing, radius — single source of truth
│   │   ├── queryClient.ts              # TanStack Query client config
|   |   ├── toast.ts
│   │   └── constants.ts                # Table name, storage bucket, query keys
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── pickImage.ts             # Image picking from library/camera
│   │   └── responsive.ts               # Tablet breakpoint, grid columns, adaptive padding
│   │
│   └── config/
│       └── env.ts                      # Typed access to EXPO_PUBLIC_ env vars
│
├── assets/
|   ├──images/
│   └── fonts/                          # Inter-Regular / Inter-Medium / Inter-Bold (.ttf, add yourself)
│
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
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`. This creates the `inventory` table and `category` table.
3. Go to **Storage** and create a new **public** bucket named `inventory-images`.

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
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key-here
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
