import Button from "@/src/components/ui/Button"
import { colors, fonts, spacing } from "@/src/lib/theme"
import { StyleSheet, Text, View } from "react-native"

interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  title = "Nothing Here",
  message = "No data available.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrapper}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm + 2,
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  actionWrapper: {
    minWidth: 180,
  },
})
