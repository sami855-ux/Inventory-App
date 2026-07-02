import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import type { InventoryItem } from "@/src/types/inventory"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

interface InventoryCardProps {
  item: InventoryItem
  onPress: () => void
  onDelete: () => void
}

export function InventoryCard({ item, onPress, onDelete }: InventoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.quantity} numberOfLines={1}>
          Qty: {item.quantity}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>

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
    // elevation: 1,
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
  details: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs - 1,
  },
  quantity: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 2,
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
