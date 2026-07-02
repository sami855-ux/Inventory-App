export const TABLE_NAME = "inventory"

export const BUCKET_NAME = "inventory-images"

export const PAGE_SIZE = 5

export const QUERY_KEYS = {
  inventory: ["inventory"],
  inventoryItem: (id: string) => ["inventory", id],
}
