import { InventoryForm } from "@/src/components/inventory/InventoryForm"
import ScreenContainer from "@/src/components/layout/ScreenContainer"
import { AlertDialog } from "@/src/components/ui/AlertDialog"
import Button from "@/src/components/ui/Button"
import ErrorState from "@/src/components/ui/ErrorState"
import LoadingSpinner from "@/src/components/ui/LoadingSpinner"
import { useDeleteInventoryItem } from "@/src/hooks/useDeleteInventoryItem"
import { useInventoryItem } from "@/src/hooks/useInventoryItem"
import { useUpdateInventoryItem } from "@/src/hooks/useUpdateInventoryItem"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"
import type { InventoryItemInput } from "@/src/types/inventory"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { uploadImage } from "@/src/api/storage"
import { Ionicons } from "@expo/vector-icons"

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const {
    data: item,
    isPending,
    isError,
    error,
    refetch,
  } = useInventoryItem(id)

  const {
    mutate: updateItem,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateInventoryItem()

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteInventoryItem()

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  if (isPending) {
    return (
      <ScreenContainer>
        <LoadingSpinner label="Loading item..." />
      </ScreenContainer>
    )
  }

  if (isError || !item) {
    return (
      <ScreenContainer>
        <ErrorState
          message={error?.message ?? "Item not found"}
          onRetry={refetch}
        />
      </ScreenContainer>
    )
  }

  async function handleUpdate(
    input: InventoryItemInput,
    newImage: string | null,
  ) {
    try {
      let imageUrl = item?.image_url
      let imagePath = item?.image_path

      // 1. Upload image if new one exists
      if (newImage) {
        const uploadResult = await uploadImage(newImage?.uri)

        imageUrl = uploadResult.publicUrl
        imagePath = uploadResult.path
      }

      console.log(imagePath, imageUrl)

      // 2. Prepare updates
      const updates = {
        ...input,
        image_url: imageUrl,
        image_path: imagePath,
      }

      // 3. Save to DB
      updateItem(
        {
          id: item?.id,
          updates,
        },
        {
          onSuccess: () => setIsEditing(false),
        },
      )
    } catch (error: any) {
      console.log(error.message)
    }
  }

  function handleConfirmDelete() {
    setDeleteError(null)

    deleteItem(
      { id: item.id, image_path: item.image_path },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          router.back()
        },
        onError: (err) => setDeleteError(err.message),
      },
    )
  }

  if (isEditing) {
    return (
      <ScreenContainer>
        <InventoryForm
          initialValues={{
            name: item.name,
            description: item.description,
            quantity: String(item.quantity),
            price: String(item.price),
          }}
          initialImageUrl={item.image_url}
          submitLabel="Save Changes"
          submitting={isUpdating}
          onSubmit={handleUpdate}
        />

        {updateError ? (
          <View style={styles.inlineErrorBar}>
            <Text style={styles.inlineErrorText}>{updateError.message}</Text>
          </View>
        ) : null}
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Item Details</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGE CARD */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: item.image_url ?? undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* NAME + PRICE */}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>

        {/* META CARD */}
        <View style={styles.card}>
          <Text style={styles.metaLabel}>Quantity</Text>
          <Text style={styles.metaValue}>{item.quantity}</Text>
        </View>

        {/* DESCRIPTION CARD */}
        <View style={styles.card}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <Button
              title="Edit"
              onPress={() => setIsEditing(true)}
              variant="secondary"
            />
          </View>

          <View style={styles.actionButton}>
            <Button
              title="Delete"
              onPress={() => setIsDeleteDialogOpen(true)}
              variant="danger"
            />
          </View>
        </View>
      </ScrollView>

      {/* DELETE DIALOG */}
      <AlertDialog
        visible={isDeleteDialogOpen}
        title="Delete item"
        message={
          deleteError ??
          `Are you sure you want to delete "${item.name}"? This can't be undone.`
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setDeleteError(null)
        }}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    gap: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  /* CONTENT */
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },

  /* IMAGE */
  imageCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  image: {
    width: "100%",
    height: 240,
  },

  /* TEXT */
  name: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  /* CARD STYLE SECTIONS */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  metaLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaValue: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },

  descriptionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },

  /* ERROR */
  inlineErrorBar: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: "#FEF0F0",
    borderRadius: radius.md,
    padding: spacing.md,
  },
  inlineErrorText: {
    color: colors.danger,
    fontFamily: fonts.regular,
    fontSize: 13,
    textAlign: "center",
  },
})
