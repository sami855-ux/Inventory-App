import { InventoryList } from "@/src/components/inventory/InventoryList"
import { InventoryListSkeleton } from "@/src/components/inventory/InventoryListSkeleton"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import Button from "@/src/components/ui/Button"
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
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

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
          {/* Filter Button - disabled during loading */}
          <TouchableOpacity style={styles.filterButton} disabled={true}>
            <Ionicons
              name="options-outline"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Skeleton */}
        <InventoryListSkeleton count={5} />
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
        <ErrorState message={error.message} onRetry={refetch} />
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

      {/* Filter/Sort Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            <Text style={styles.modalTitle}>Filter & Sort</Text>

            {/* Filter Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Filter by</Text>
              <View style={styles.modalOptions}>
                {FILTER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.modalOption,
                      tempFilter === option.key && styles.modalOptionActive,
                    ]}
                    onPress={() => setTempFilter(option.key)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        tempFilter === option.key &&
                          styles.modalOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempFilter === option.key && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Sort by</Text>
              <View style={styles.modalOptions}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.modalOption,
                      tempSortBy === option.key && styles.modalOptionActive,
                    ]}
                    onPress={() => setTempSortBy(option.key)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        tempSortBy === option.key &&
                          styles.modalOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempSortBy === option.key && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalResetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalApplyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.modalApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 34,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  modalOptions: {
    gap: 8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalOptionActive: {
    backgroundColor: "#EFF6FF",
    borderColor: colors.primary,
  },
  modalOptionText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  modalResetButton: {
    backgroundColor: colors.borderLight,
  },
  modalResetText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  modalApplyButton: {
    backgroundColor: colors.primary,
  },
  modalApplyText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: "#fff",
  },
})
