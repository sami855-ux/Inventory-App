import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createItem } from "@/src/api/inventory"
import { CreateInventoryItem } from "@/src/types/inventory"

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item: CreateInventoryItem) => createItem(item),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      })
    },
  })
}
