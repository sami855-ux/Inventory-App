import { getItems } from "@/src/api/inventory"
import { useInfiniteQuery } from "@tanstack/react-query"
import { PAGE_SIZE } from "../api/constants"

export function useInfiniteInventoryList() {
  return useInfiniteQuery({
    queryKey: ["inventory"],

    queryFn: ({ pageParam = 0 }) => getItems(pageParam),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      const safeLastPage = lastPage ?? []

      if (safeLastPage.length < PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
  })
}
