import {
  Category,
  CreateInventoryItem,
  InventoryItem,
  LocalImage,
  UpdateInventoryItem,
} from "@/src/types/inventory"
import { PAGE_SIZE, TABLE_NAME } from "./constants"
import { deleteImage, uploadImage } from "./storage"
import { supabase } from "./supabaseClient"

// GET ITEMS (exclude deleted)
export async function getItems(page: number = 0): Promise<InventoryItem[]> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *,
      categories:category_id (
        id,
        name
      )
    `,
    )
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error
  return data ?? []
}

// GET SINGLE ITEM (prevent deleted access)
export async function getItem(id: string): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *,
      categories:category_id (
        id,
        name
      )
    `,
    )
    .eq("id", id)
    .eq("is_deleted", false)
    .single()

  if (error) throw error
  return data as InventoryItem
}

// CREATE ITEM
export async function createInventoryItem(
  item: CreateInventoryItem,
  image: LocalImage,
) {
  const { publicUrl, path } = await uploadImage(image)

  console.log("insert payload:", {
    ...item,
    image_url: publicUrl,
    image_path: path,
    category_id: item.category_id ?? null,
  })

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...item,
      image_url: publicUrl,
      image_path: path,
      category_id: item.category_id ?? null,
    })
    .select()
    .single()

  if (error) {
    await deleteImage(path).catch(() => {})
    throw error
  }

  return data
}

// UPDATE ITEM — supports replacing the image
export async function updateItem(params: {
  id: string
  updates: UpdateInventoryItem
  newImage?: LocalImage
  currentImagePath: string
}) {
  const { id, updates, newImage, currentImagePath } = params

  let imageFields: { image_url?: string; image_path?: string } = {}

  if (newImage) {
    const { publicUrl, path } = await uploadImage(newImage)
    imageFields = {
      image_url: publicUrl,
      image_path: path,
    }
  }

  const updateData: any = {
    ...updates,
    ...imageFields,
  }

  if (updates.category_id !== undefined) {
    updateData.category_id = updates.category_id
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    // rollback uploaded image if DB fails
    if (imageFields.image_path) {
      await deleteImage(imageFields.image_path).catch(() => {})
    }
    throw error
  }

  // delete old image AFTER successful update
  if (newImage && currentImagePath) {
    await deleteImage(currentImagePath).catch(() => {
      console.warn(`Failed to delete previous image for item ${id}`)
    })
  }

  return data
}

// SOFT DELETE — also removes the image from Storage
export async function deleteInventoryItem(
  item: Pick<InventoryItem, "id" | "image_path">,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", item.id)

  if (error) throw new Error(error.message)

  await deleteImage(item.image_path!).catch(() => {
    console.warn(`Failed to delete image for item ${item.id}`)
  })
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
