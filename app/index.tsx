import { InventoryList } from "@/src/components/inventory/InventoryList"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import Button from "@/src/components/ui/Button"
import ErrorState from "@/src/components/ui/ErrorState"
import FilterChip from "@/src/components/ui/Filterchip"
import LoadingSpinner from "@/src/components/ui/LoadingSpinner"
import { useDeleteInventoryItem } from "@/src/hooks/useDeleteInventoryItem"
import { useInfiniteInventoryList } from "@/src/hooks/useInventoryList"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import toast from "@/src/lib/toast"
import type {
  InventoryFilter,
  InventoryItem,
  InventorySort,
} from "@/src/types/inventory"
import { responsiveHorizontalPadding } from "@/src/utils/responsive"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"

const FILTER_OPTIONS: { key: InventoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "inStock", label: "In Stock" },
  { key: "lowStock", label: "Low Stock" },
]

const SORT_OPTIONS: { key: InventorySort; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
]

export default function InventoryListScreen() {
  const router = useRouter()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteInventoryList()

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteInventoryItem()

  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<InventoryFilter>("all")
  const [sortBy, setSortBy] = useState<InventorySort>("newest")
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<InventoryItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function handleAdd() {
    router.push("/item/create")
  }

  function handleCycleSort() {
    const currentIndex = SORT_OPTIONS.findIndex(
      (option) => option.key === sortBy,
    )
    const next = SORT_OPTIONS[(currentIndex + 1) % SORT_OPTIONS.length]
    setSortBy(next.key)
  }

  function handleDelete(item: InventoryItem) {
    setDeleteError(null)
    setPendingDeleteItem(item)
  }

  function handleConfirmDelete() {
    if (!pendingDeleteItem) return

    setDeleteError(null)

    deleteItem(
      { id: pendingDeleteItem.id, image_path: pendingDeleteItem.image_path },
      {
        onSuccess: () => {
          setPendingDeleteItem(null)
          toast.success("Item deleted successfully")
        },
        onError: (err) => setDeleteError(err.message),
      },
    )
  }

  function handleCancelDelete() {
    setPendingDeleteItem(null)
    setDeleteError(null)
  }

  const items = data?.pages.flat() ?? []

  const itemCount = items.length

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? "Newest"

  const horizontalPadding = responsiveHorizontalPadding()

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>
            {isPending
              ? "Loading items..."
              : `${itemCount} item${itemCount === 1 ? "" : "s"} in stock`}
          </Text>
        </View>

        <View style={styles.addButton}>
          <Button title="+ Add" onPress={handleAdd} />
        </View>
      </View>

      {/* Search */}
      <View
        style={[styles.searchWrapper, { paddingHorizontal: horizontalPadding }]}
      >
        <View style={styles.searchInputRow}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingHorizontal: horizontalPadding }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_OPTIONS.map((option) => (
            <FilterChip
              key={option.key}
              label={option.label}
              active={filter === option.key}
              onPress={() => setFilter(option.key)}
            />
          ))}

          <FilterChip
            label={`Sort: ${currentSortLabel}`}
            active={false}
            onPress={handleCycleSort}
          />
        </ScrollView>
      </View>

      {/* Content */}
      {isPending ? (
        <LoadingSpinner label="Loading inventory..." />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <InventoryList
          items={items}
          refreshing={isRefetching}
          onRefresh={refetch}
          onDelete={handleDelete}
          searchQuery={searchQuery}
          filter={filter}
          sortBy={sortBy}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          isLoadingMore={isFetchingNextPage}
        />
      )}

      <AlertDialog
        visible={pendingDeleteItem !== null}
        title="Delete item"
        message={
          pendingDeleteItem
            ? (deleteError ??
              `Are you sure you want to delete "${pendingDeleteItem.name}"? This can't be undone.`)
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    minWidth: 96,
  },
  searchWrapper: {
    marginBottom: spacing.md,
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.xs,
  },
  chipDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
})
