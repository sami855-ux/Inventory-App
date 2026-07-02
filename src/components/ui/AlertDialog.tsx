import Button from "@/src/components/ui/Button"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import { Ionicons } from "@expo/vector-icons"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

export type AlertDialogVariant = "default" | "danger"

interface AlertDialogProps {
  visible: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: AlertDialogVariant
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ICONS: Record<AlertDialogVariant, keyof typeof Ionicons.glyphMap> = {
  default: "information-circle",
  danger: "warning",
}

export function AlertDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const isDanger = variant === "danger"

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={styles.cardWrapper}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.card}>
            <View
              style={[styles.iconWrapper, isDanger && styles.iconWrapperDanger]}
            >
              <Ionicons
                name={ICONS[variant]}
                size={26}
                color={isDanger ? colors.danger : colors.primary}
              />
            </View>

            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={styles.actions}>
              <View style={styles.actionButton}>
                <Button
                  title={cancelLabel}
                  onPress={onCancel}
                  variant="secondary"
                  disabled={loading}
                />
              </View>
              <View style={styles.actionButton}>
                <Button
                  title={confirmLabel}
                  onPress={onConfirm}
                  variant={isDanger ? "danger" : "primary"}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 17, 21, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 360,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EFF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  iconWrapperDanger: {
    backgroundColor: "#FEF0F0",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs + 2,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm + 2,
    width: "100%",
    marginTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
  },
})
