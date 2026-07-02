import { deleteInventoryItem } from "@/src/api/inventory"
import { QUERY_KEYS } from "@/src/lib/constants"
import type { InventoryItem } from "@/src/types/inventory"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item: Pick<InventoryItem, "id" | "image_path">) =>
      deleteInventoryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryList })
    },
  })
}
