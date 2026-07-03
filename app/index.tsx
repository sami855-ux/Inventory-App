import {
  FILTER_OPTIONS,
  FilterSortModal,
  SORT_OPTIONS,
} from "@/src/components/inventory/FilterSortModal"
import { InventoryGrid } from "@/src/components/inventory/InventoryGrid"
import { InventoryList } from "@/src/components/inventory/InventoryList"
import { InventoryListSkeleton } from "@/src/components/inventory/InventoryListSkeleton"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import Button from "@/src/components/ui/Button"
import EmptyState from "@/src/components/ui/EmptyState"
import ErrorState from "@/src/components/ui/ErrorState"
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
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

type ViewMode = "list" | "grid"

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
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<InventoryItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  // Temporary state for modal selections
  const [tempFilter, setTempFilter] = useState<InventoryFilter>("all")
  const [tempSortBy, setTempSortBy] = useState<InventorySort>("newest")

  function handleAdd() {
    router.push("/item/create")
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

  function openFilterModal() {
    setTempFilter(filter)
    setTempSortBy(sortBy)
    setIsFilterModalVisible(true)
  }

  function applyFilters() {
    setFilter(tempFilter)
    setSortBy(tempSortBy)
    setIsFilterModalVisible(false)
  }

  function resetFilters() {
    setTempFilter("all")
    setTempSortBy("newest")
    setFilter("all")
    setSortBy("newest")
    setIsFilterModalVisible(false)
  }

  function toggleViewMode() {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  const items = data?.pages.flat() ?? []
  const itemCount = items.length
  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? "Newest"
  const currentFilterLabel =
    FILTER_OPTIONS.find((option) => option.key === filter)?.label ?? "All"
  const horizontalPadding = responsiveHorizontalPadding()

  const hasActiveFilters = filter !== "all" || sortBy !== "newest"

  // Show skeleton while loading
  if (isPending) {
    return (
      <ScreenContainer>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Inventory</Text>
            <Text style={styles.subtitle}>Loading items...</Text>
          </View>
          <View style={styles.addButton}>
            <Button title="+ Add" onPress={handleAdd} />
          </View>
        </View>

        {/* Search + Filter Row (disabled during loading) */}
        <View
          style={[
            styles.searchWrapper,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.searchInputRow}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search items..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              editable={false}
            />
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.filterButton} disabled={true}>
              <Ionicons
                name="options-outline"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Skeleton */}
        <InventoryListSkeleton count={10} />
      </ScreenContainer>
    )
  }

  if (isError) {
    return (
      <ScreenContainer>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Inventory</Text>
            <Text style={styles.subtitle}>Error loading items</Text>
          </View>
          <View style={styles.addButton}>
            <Button title="+ Add" onPress={handleAdd} />
          </View>
        </View>
        <ErrorState
          title="Failed to Load Inventory"
          message={
            error.message ||
            "Unable to fetch your inventory items. Please check your connection and try again."
          }
          onRetry={refetch}
        />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>
            {`${itemCount} item${itemCount === 1 ? "" : "s"} in stock`}
          </Text>
        </View>

        <View style={styles.addButton}>
          <Button title="+ Add" onPress={handleAdd} />
        </View>
      </View>

      {/* Search + Filter Row */}
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
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionButtons}>
          {/* View Toggle Button */}
          <TouchableOpacity
            style={styles.viewToggleButton}
            onPress={toggleViewMode}
            activeOpacity={0.7}
          >
            <Ionicons
              name={viewMode === "list" ? "grid-outline" : "list-outline"}
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Filter Button */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
            onPress={openFilterModal}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={hasActiveFilters ? colors.white : colors.textPrimary}
            />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>!</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <View
          style={[
            styles.activeFilters,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.activeFiltersLeft}>
            <Ionicons name="filter" size={14} color={colors.primary} />
            <Text style={styles.activeFiltersText}>
              {currentFilterLabel} • Sort: {currentSortLabel}
            </Text>
          </View>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {items.length === 0 && !isPending && !isError ? (
        <EmptyState
          title="No Items Found"
          message={
            searchQuery
              ? "No items match your search criteria. Try adjusting your filters."
              : "Your inventory is empty. Start by adding your first item."
          }
          actionLabel={searchQuery ? "Clear Search" : "Add Item"}
          onAction={searchQuery ? () => setSearchQuery("") : handleAdd}
        />
      ) : viewMode === "list" ? (
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
      ) : (
        <InventoryGrid
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

      {/* Filter/Sort Modal */}
      <FilterSortModal
        visible={isFilterModalVisible}
        filter={filter}
        sortBy={sortBy}
        tempFilter={tempFilter}
        tempSortBy={tempSortBy}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        onTempFilterChange={setTempFilter}
        onTempSortChange={setTempSortBy}
      />

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
    minWidth: 80,
  },
  searchWrapper: {
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInputRow: {
    flex: 1,
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  viewToggleButton: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  filterBadgeText: {
    fontSize: 8,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  activeFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: "#EFF6FF",
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
  },
  activeFiltersLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  activeFiltersText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
})
