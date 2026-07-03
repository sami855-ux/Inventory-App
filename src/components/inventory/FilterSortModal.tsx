import { colors, fonts, radius } from "@/src/lib/theme"
import { Ionicons } from "@expo/vector-icons"
import { useEffect } from "react"
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

export type InventoryFilter = "all" | "inStock" | "lowStock"
export type InventorySort = "newest" | "name" | "price" | "quantity"

export const FILTER_OPTIONS: {
  key: InventoryFilter
  label: string
  icon: string
}[] = [
  { key: "all", label: "All Items", icon: "grid-outline" },
  { key: "inStock", label: "In Stock", icon: "checkmark-circle-outline" },
  { key: "lowStock", label: "Low Stock", icon: "warning-outline" },
]

export const SORT_OPTIONS: {
  key: InventorySort
  label: string
  icon: string
}[] = [
  { key: "newest", label: "Newest First", icon: "time-outline" },
  { key: "name", label: "Alphabetical", icon: "text-outline" },
  { key: "price", label: "Price", icon: "cash-outline" },
  { key: "quantity", label: "Quantity", icon: "cube-outline" },
]

interface FilterSortModalProps {
  visible: boolean
  filter: InventoryFilter
  sortBy: InventorySort
  tempFilter: InventoryFilter
  tempSortBy: InventorySort
  onClose: () => void
  onApply: () => void
  onReset: () => void
  onTempFilterChange: (filter: InventoryFilter) => void
  onTempSortChange: (sort: InventorySort) => void
}

export function FilterSortModal({
  visible,
  filter,
  sortBy,
  tempFilter,
  tempSortBy,
  onClose,
  onApply,
  onReset,
  onTempFilterChange,
  onTempSortChange,
}: FilterSortModalProps) {
  // Animated value for backdrop opacity
  const backdropOpacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      })
    } else {
      backdropOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease,
      })
    }
  }, [visible])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, backdropStyle]}>
        <Pressable style={styles.modalOverlayPressable} onPress={onClose}>
          <View style={styles.modalContent}>
            {/* Drag handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Filter Section */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="funnel-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.modalSectionTitle}>Filter by</Text>
                </View>
                <View style={styles.modalOptions}>
                  {FILTER_OPTIONS.map((option, index) => {
                    const isActive = tempFilter === option.key
                    return (
                      <View key={option.key}>
                        <TouchableOpacity
                          style={[
                            styles.modalOption,
                            isActive && styles.modalOptionActive,
                          ]}
                          onPress={() => onTempFilterChange(option.key)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalOptionLeft}>
                            <Ionicons
                              name={option.icon as any}
                              size={20}
                              color={
                                isActive ? colors.primary : colors.textSecondary
                              }
                              style={styles.modalOptionIcon}
                            />
                            <Text
                              style={[
                                styles.modalOptionText,
                                isActive && styles.modalOptionTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </View>
                          {isActive && (
                            <Animated.View entering={FadeIn}>
                              <View style={styles.checkmarkCircle}>
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color={colors.white}
                                />
                              </View>
                            </Animated.View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </View>
              </View>

              <View style={styles.divider} />

              {/* Sort Section */}
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="swap-vertical-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.modalSectionTitle}>Sort by</Text>
                </View>
                <View style={styles.modalOptions}>
                  {SORT_OPTIONS.map((option, index) => {
                    const isActive = tempSortBy === option.key
                    return (
                      <View key={option.key}>
                        <TouchableOpacity
                          style={[
                            styles.modalOption,
                            isActive && styles.modalOptionActive,
                          ]}
                          onPress={() => onTempSortChange(option.key)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalOptionLeft}>
                            <Ionicons
                              name={option.icon as any}
                              size={20}
                              color={
                                isActive ? colors.primary : colors.textSecondary
                              }
                              style={styles.modalOptionIcon}
                            />
                            <Text
                              style={[
                                styles.modalOptionText,
                                isActive && styles.modalOptionTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </View>
                          {isActive && (
                            <Animated.View entering={FadeIn}>
                              <View style={styles.checkmarkCircle}>
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color={colors.white}
                                />
                              </View>
                            </Animated.View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalResetButton]}
                onPress={onReset}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalApplyButton]}
                onPress={onApply}
                activeOpacity={0.7}
              >
                <Text style={styles.modalApplyText}>Apply Filters</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayPressable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 34,
    maxHeight: "85%",
    height: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    flex: 1,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  modalOptions: {
    gap: 6,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  modalOptionActive: {
    backgroundColor: "#EFF6FF",
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalOptionIcon: {
    width: 24,
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
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  modalResetButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalResetText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  modalApplyButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalApplyText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.white,
  },
})
