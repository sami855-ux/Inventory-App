import { colors, radius, spacing } from "@/src/lib/theme"
import React from "react"
import { StyleSheet, View } from "react-native"

interface InventoryListSkeletonProps {
  count?: number
}

export function InventoryListSkeleton({
  count = 5,
}: InventoryListSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Image skeleton */}
          <View style={styles.imageSkeleton} />

          {/* Details skeleton */}
          <View style={styles.details}>
            <View style={styles.nameRow}>
              <View style={styles.nameSkeleton} />
              <View style={styles.categorySkeleton} />
            </View>
            <View style={styles.quantitySkeleton} />
            <View style={styles.priceSkeleton} />
          </View>

          {/* Delete button skeleton */}
          <View style={styles.deleteSkeleton} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
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
  },
  imageSkeleton: {
    width: 66,
    height: 66,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
  },
  details: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameSkeleton: {
    height: 16,
    width: "60%",
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  categorySkeleton: {
    height: 14,
    width: 60,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
  },
  quantitySkeleton: {
    height: 13,
    width: "40%",
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  priceSkeleton: {
    height: 14,
    width: "30%",
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  deleteSkeleton: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
})
