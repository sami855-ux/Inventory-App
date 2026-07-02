import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { InventoryForm } from "@/src/components/inventory/InventoryForm"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import { useCreateInventoryItem } from "@/src/hooks/useCreateInventoryItem"
import { colors, fonts, spacing } from "@/src/lib/theme"
import type { InventoryItemInput, LocalImage } from "@/src/types/inventory"

export default function CreateItemScreen() {
  const { mutate, isPending } = useCreateInventoryItem()
  const [errorDialog, setErrorDialog] = useState<{
    title: string
    message: string
    variant: "default" | "danger"
  } | null>(null)

  function handleSubmit(
    input: InventoryItemInput,
    newImage: LocalImage | null,
  ) {
    if (!newImage) {
      setErrorDialog({
        title: "Image required",
        message: "Please select an image for this item before saving.",
        variant: "default",
      })
      return
    }

    mutate(
      { input, image: newImage },
      {
        onSuccess: () => {
          router.back()
        },
        onError: (err) => {
          setErrorDialog({
            title: "Failed to create item",
            message: err.message,
            variant: "danger",
          })
        },
      },
    )
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>New Item</Text>
        <Text style={styles.subtitle}>Add a new item to your inventory</Text>
      </View>

      <InventoryForm
        submitLabel="Create Item"
        submitting={isPending}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        visible={errorDialog !== null}
        title={errorDialog?.title ?? ""}
        message={errorDialog?.message}
        confirmLabel="OK"
        variant={errorDialog?.variant ?? "default"}
        onConfirm={() => setErrorDialog(null)}
        onCancel={() => setErrorDialog(null)}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: { fontSize: 22, fontFamily: fonts.bold, color: colors.textPrimary },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
})
