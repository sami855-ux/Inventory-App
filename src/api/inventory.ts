import {
  CreateInventoryItem,
  InventoryItem,
  LocalImage,
  UpdateInventoryItem,
} from "@/src/types/inventory"

import { PAGE_SIZE, TABLE_NAME } from "./constants"
import { deleteImage, uploadImage } from "./storage"
import { supabase } from "./supabaseClient"

//  GET ITEMS (exclude deleted)
export async function getItems(page: number = 0) {
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

//  GET SINGLE ITEM (prevent deleted access)
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

//  CREATE ITEM (unchanged)
export async function createInventoryItem(
  item: CreateInventoryItem,
  image: LocalImage,
) {
  const { publicUrl, path } = await uploadImage(image)

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

// UPDATE ITEM (unchanged logic)
export async function updateItem(id: string, updates: UpdateInventoryItem) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...updates,
      category_id: updates.category_id ?? null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
// SOFT DELETE
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
}
