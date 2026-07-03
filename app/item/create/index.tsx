import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import ImageUploader from "@/src/components/inventory/ImageUploader"
import { InventoryForm } from "@/src/components/inventory/InventoryForm"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import { useCreateInventoryItem } from "@/src/hooks/useCreateInventoryItem"
import { colors, fonts, spacing } from "@/src/lib/theme"
import type { InventoryItemInput, LocalImage } from "@/src/types/inventory"

export default function CreateItemScreen() {
  const { mutate, isPending } = useCreateInventoryItem()

  const [image, setImage] = useState<LocalImage | null>(null)

  const [errorDialog, setErrorDialog] = useState<{
    title: string
    message: string
    variant: "default" | "danger"
  } | null>(null)

  function handleSubmit(input: InventoryItemInput) {
    console.log(image, input)
    if (!image) {
      setErrorDialog({
        title: "Image required",
        message: "Please select an image for this item before saving.",
        variant: "default",
      })
      return
    }

    mutate(
      {
        input,
        image,
      },
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
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>New Item</Text>
          <Text style={styles.headerSubtitle}>
            Add a new item to your inventory
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 120 : 100}
        extraHeight={Platform.OS === "ios" ? 120 : 80}
        enableAutomaticScroll={true}
        viewIsInsideTabBar={false}
        automaticallyAdjustContentInsets={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
        keyboardOpeningTime={Platform.OS === "ios" ? 0 : 0}
      >
        <ImageUploader
          image={image?.uri ?? null}
          onChange={setImage}
          title="Tap to upload image"
          disabled={isPending}
        />

        <InventoryForm
          submitLabel="Create Item"
          submitting={isPending}
          onSubmit={handleSubmit}
        />

        {/* Add extra bottom padding */}
        <View style={styles.bottomSpacer} />
      </KeyboardAwareScrollView>

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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  // Header styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    width: 40, // To balance the back button on the left
  },
  bottomSpacer: {
    height: 100,
  },
})
