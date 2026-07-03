import type { LocalImage } from "@/src/types/inventory"
import { BUCKET_NAME } from "./constants"
import { supabase } from "./supabaseClient"

export async function uploadImage(image: LocalImage) {
  if (!image?.uri) throw new Error("Image URI is required")

  const fileExt = image.fileName.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `inventory/${fileName}`
  const mimeType =
    image.mimeType || `image/${fileExt === "jpg" ? "jpeg" : fileExt}`

  const formData = new FormData()
  formData.append("file", {
    uri: image.uri,
    name: fileName,
    type: mimeType,
  } as any)

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, formData, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}

/**
 * Delete image from Storage
 */
export async function deleteImage(path: string) {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
  if (error) throw error
}
