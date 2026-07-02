import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateItem } from "@/src/api/inventory"
import { UpdateInventoryItem } from "@/src/types/inventory"

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: UpdateInventoryItem
    }) => updateItem(id, updates),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      })

      queryClient.invalidateQueries({
        queryKey: ["inventory", variables.id],
      })
    },
    onError: (err) => {
      console.log(err)
    },
  })
}
