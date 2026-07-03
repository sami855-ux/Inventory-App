import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import type { InventoryItem } from "@/src/types/inventory"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

interface InventoryGridItemProps {
  item: InventoryItem & {
    categories?: {
      id: string
      name: string
    } | null
  }
  onPress: () => void
  onDelete: () => void
}

export function InventoryGridItem({
  item,
  onPress,
  onDelete,
}: InventoryGridItemProps) {
  const isLowStock = item.quantity <= 10

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        isLowStock && styles.lowStockCard,
      ]}
    >
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={32} color={colors.textMuted} />
          </View>
        )}

        {/* LOW STOCK BADGE - Overlay on image */}
        {isLowStock && (
          <View style={styles.imageLowStockBadge}>
            <Ionicons name="alert" size={12} color="#DC2626" />
            <Text style={styles.imageLowStockText}>Low Stock</Text>
          </View>
        )}
      </View>

      {/* DETAILS */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        {/* CATEGORY AS BADGE */}
        {item.categories?.name ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {item.categories.name}
            </Text>
          </View>
        ) : (
          <View style={[styles.categoryBadge, styles.categoryBadgeEmpty]}>
            <Text style={styles.categoryTextEmpty}>No category</Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
        </View>
      </View>

      {/* DELETE BUTTON */}
      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  lowStockCard: {
    borderColor: "#fce0e0",
    backgroundColor: "#FEF2F2",
  },
  pressed: {
    opacity: 0.85,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.borderLight,
  },
  imageLowStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  imageLowStockText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  details: {
    padding: spacing.sm,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignSelf: "flex-start",
  },
  categoryBadgeEmpty: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  categoryText: {
    fontSize: 9,
    fontFamily: fonts.medium,
    color: "#1D4ED8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  categoryTextEmpty: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  quantity: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
})
