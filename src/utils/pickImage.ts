import * as ImagePicker from "expo-image-picker"

export type LocalImage = {
  uri: string
  fileName: string
  mimeType: string
}

export async function pickImage(): Promise<LocalImage | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (!permission.granted) {
    throw new Error("Permission denied")
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  })

  if (result.canceled) return null

  const asset = result.assets[0]

  return {
    uri: asset.uri,
    fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
    mimeType: asset.mimeType ?? "image/jpeg",
  }
}
