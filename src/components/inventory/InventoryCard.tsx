import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import type { InventoryItem } from "@/src/types/inventory"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

interface InventoryCardProps {
  item: InventoryItem & {
    categories?: {
      id: string
      name: string
    } | null
  }
  onPress: () => void
  onDelete: () => void
}

export function InventoryCard({ item, onPress, onDelete }: InventoryCardProps) {
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
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      {/* DETAILS */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          {/* CATEGORY AS BADGE - Next to title */}
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
        </View>

        <View style={styles.quantityRow}>
          <Text style={styles.quantity} numberOfLines={1}>
            Qty: {item.quantity}
          </Text>

          {/* LOW STOCK BADGE */}
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <Ionicons name="alert" size={12} color="#DC2626" />
              <Text style={styles.lowStockText}>Low Stock</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>

      {/* DELETE */}
      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
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

  image: {
    width: 66,
    height: 66,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
  },

  noImage: {
    width: 66,
    height: 66,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  details: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.xs - 1,
  },

  name: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    flexShrink: 1,
  },

  // Category Badge Styles
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexShrink: 0,
  },

  categoryBadgeEmpty: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },

  categoryText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: "#1D4ED8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  categoryTextEmpty: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },

  quantity: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },

  // Low Stock Badge Styles
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  lowStockText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  price: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  deleteButton: {
    padding: spacing.xs + 2,
  },
})
