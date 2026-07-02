import {
  CreateInventoryItem,
  InventoryItem,
  LocalImage,
  UpdateInventoryItem,
} from "@/src/types/inventory"

import { PAGE_SIZE, TABLE_NAME } from "./constants"
import { deleteImage, uploadImage } from "./storage"
import { supabase } from "./supabaseClient"

export async function getItems(page: number = 0): Promise<InventoryItem[]> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return data ?? []
}

export async function getItem(id: string): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error

  return data as InventoryItem
}

export async function createInventoryItem(
  item: CreateInventoryItem,
  image: LocalImage,
): Promise<InventoryItem> {
  const { publicUrl, path } = await uploadImage(image)

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...item,
      image_url: publicUrl,
      image_path: path,
    })
    .select()
    .single()

  if (error) {
    // Roll back the uploaded image if the insert fails, so we don't leave
    // an orphaned file in Storage for an item that was never created.
    await deleteImage(path).catch(() => {})
    throw error
  }

  return data as InventoryItem
}

export async function updateItem(
  id: string,
  updates: UpdateInventoryItem,
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data as InventoryItem
}

export async function deleteInventoryItem(
  item: Pick<InventoryItem, "id" | "image_path">,
): Promise<void> {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", item.id)
  if (error) throw new Error(error.message)

  // Delete the image after the row is gone; if this fails it's an orphaned
  // file, not an orphaned/broken DB row.
  // await deleteImage(item.image_path).catch(() => {
  //   console.warn(`Failed to delete image for item ${item.id}`);
  // });
}
