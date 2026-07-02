import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native"

import EmptyState from "@/src/components/ui/EmptyState"
import { colors, spacing } from "@/src/lib/theme"
import type { InventoryItem } from "@/src/types/inventory"
import {
  listColumns,
  responsiveHorizontalPadding,
} from "@/src/utils/responsive"
import { useRouter } from "expo-router"
import { InventoryCard } from "./InventoryCard"

interface InventoryListProps {
  items: InventoryItem[]
  refreshing: boolean
  onRefresh: () => void
  onDelete: (item: InventoryItem) => void

  onEndReached?: () => void
  isLoadingMore?: boolean

  // existing
  searchQuery: string
  filter?: "all" | "lowStock" | "inStock"
  sortBy?: "name" | "price" | "quantity" | "newest"
}

export function InventoryList({
  items,
  refreshing,
  onRefresh,
  onDelete,
  onEndReached,
  isLoadingMore = false,
  searchQuery,
  filter = "all",
  sortBy = "newest",
}: InventoryListProps) {
  const router = useRouter()

  const getProcessedItems = () => {
    let result = [...items]

    // 🔎 SEARCH
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      )
    }

    // 🎯 FILTER
    switch (filter) {
      case "lowStock":
        result = result.filter((item) => item.quantity <= 10)
        break
      case "inStock":
        result = result.filter((item) => item.quantity > 0)
        break
    }

    // 🔃 SORT
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price":
        result.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "quantity":
        result.sort((a, b) => a.quantity - b.quantity)
        break
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        break
    }

    return result
  }

  const displayItems = getProcessedItems()

  return (
    <FlatList
      data={displayItems}
      keyExtractor={(item) => item.id}
      numColumns={listColumns}
      key={listColumns}
      columnWrapperStyle={listColumns > 1 ? styles.row : undefined}
      contentContainerStyle={[
        styles.listContent,
        displayItems.length === 0 && styles.emptyContainer,
        { paddingHorizontal: responsiveHorizontalPadding() },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }

      // 🔥 INFINITE SCROLL TRIGGER
      onEndReached={() => {
        if (onEndReached && !isLoadingMore) {
          onEndReached()
        }
      }}
      onEndReachedThreshold={0.5}

      // 🔥 FOOTER LOADING
      ListFooterComponent={
        isLoadingMore ? (
          <View style={{ paddingVertical: spacing.md }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }

      ListEmptyComponent={
        <EmptyState
          title="No results found"
          message="Try adjusting your search or filters."
          actionLabel="Add Item"
        />
      }

      renderItem={({ item }) => (
        <View style={listColumns > 1 ? styles.gridCell : undefined}>
          <InventoryCard
            item={item}
            onPress={() =>
              router.push({
                pathname: `/item/[id]`,
                params: { id: item.id },
              })
            }
            onDelete={() => onDelete(item)}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },

  emptyContainer: {
    justifyContent: "center",
  },

  row: {
    gap: spacing.md,
  },

  gridItem: {
    flex: 1,
  },

  gridCell: {
    flex: 1,
  },
})
