import { createInventoryItem } from "@/src/api/inventory"
import { QUERY_KEYS } from "@/src/lib/constants"
import type { InventoryItemInput, LocalImage } from "@/src/types/inventory"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      input,
      image,
    }: {
      input: InventoryItemInput
      image: LocalImage
    }) => createInventoryItem(input, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryList })
    },
  })
}
