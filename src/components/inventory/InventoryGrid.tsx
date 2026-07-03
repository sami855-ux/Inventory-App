import { spacing } from "@/src/lib/theme"
import { InventoryItem } from "@/src/types/inventory"
import { useRouter } from "expo-router"
import { FlatList, StyleSheet } from "react-native"
import LoadingSpinner from "../ui/LoadingSpinner"
import { InventoryFilter, InventorySort } from "./FilterSortModal"
import { InventoryGridItem } from "./InventoryGridItem"

interface InventoryGridProps {
  items: InventoryItem[]
  refreshing: boolean
  onRefresh: () => void
  onDelete: (item: InventoryItem) => void
  searchQuery: string
  filter: InventoryFilter
  sortBy: InventorySort
  onEndReached: () => void
  isLoadingMore: boolean
}

export function InventoryGrid({
  items,
  refreshing,
  onRefresh,
  onDelete,
  searchQuery,
  filter,
  sortBy,
  onEndReached,
  isLoadingMore,
}: InventoryGridProps) {
  const router = useRouter()

  // Filter and sort logic here (same as InventoryList)
  const filteredItems = items.filter((item) => {
    // Apply search
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    // Apply filter
    if (filter === "inStock" && item.quantity <= 0) return false
    if (filter === "lowStock" && item.quantity > 10) return false
    return true
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price":
        return a.price - b.price
      case "quantity":
        return a.quantity - b.quantity
      case "newest":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  })

  return (
    <FlatList
      data={sortedItems}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      renderItem={({ item }) => (
        <InventoryGridItem
          item={item}
          onDelete={() => onDelete(item)}
          onPress={() =>
            router.push({
              pathname: `/item/[id]`,
              params: { id: item.id },
            })
          }
        />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isLoadingMore ? <LoadingSpinner size="large" /> : null
      }
      contentContainerStyle={styles.content}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
})
