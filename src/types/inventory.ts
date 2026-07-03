export interface InventoryItem {
  id: string
  name: string
  description: string | null
  quantity: number
  price: number
  image_url: string | null
  image_path: string | null
  category_id: string | null
  is_deleted: boolean
  deleted_at: string
  created_at: string
  updated_at: string
}
export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface CreateInventoryItem {
  name: string
  description?: string | null
  quantity: number
  price: number
  image_url?: string | null
  image_path?: string | null
  category_id: string | null
}

export interface UpdateInventoryItem {
  name?: string
  description?: string | null
  quantity?: number
  price?: number
  image_url?: string | null
  image_path?: string | null
  category_id: string | null
}

export type InventoryFilter = "all" | "lowStock" | "inStock"
export type InventorySort = "name" | "price" | "quantity" | "newest"

export type InventoryItemInput = {
  name: string
  description: string
  quantity: number
  price: number
  category_id: string
}

export interface LocalImage {
  uri: string
  fileName: string
  mimeType: string
}
