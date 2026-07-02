import { BUCKET_NAME } from "./constants"
import { supabase } from "./supabaseClient"

export async function uploadImage(uri: string) {
  if (!uri) throw new Error("Image URI is required")

  const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg"

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`

  const filePath = `inventory/${fileName}`

  // ✅ Create form data (NO expo-file-system needed)
  const formData = new FormData()

  formData.append("file", {
    uri,
    name: fileName,
    type: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
  } as any)

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, formData.get("file") as any, {
      contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
      upsert: false,
    })

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
