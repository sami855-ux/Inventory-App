import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateItem } from "@/src/api/inventory"
import { LocalImage, UpdateInventoryItem } from "@/src/types/inventory"

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
      newImage,
      currentImagePath,
    }: {
      id: string
      updates: UpdateInventoryItem
      newImage?: LocalImage
      currentImagePath: string
    }) =>
      updateItem({
        id,
        updates,
        newImage,
        currentImagePath,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      })

      queryClient.invalidateQueries({
        queryKey: ["inventory", variables.id],
      })
    },

    onError: (err) => {
      console.log("Update inventory error:", err)
    },
  })
}
