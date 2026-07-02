import { getItem } from "@/src/api/inventory"
import { useQuery } from "@tanstack/react-query"

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getItem(id),
    enabled: !!id,
  })
}
