export const QUERY_KEYS = {
  inventoryList: ["inventory"] as const,
  inventoryItem: (id: string) => ["inventory", id] as const,
}
