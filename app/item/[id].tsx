import { uploadImage } from "@/src/api/storage"
import ImageUploader from "@/src/components/inventory/ImageUploader"
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
import type { InventoryItemInput, LocalImage } from "@/src/types/inventory"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

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
  const [selectedImage, setSelectedImage] = useState<LocalImage | null>(null)

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

  async function handleUpdate(input: InventoryItemInput) {
    try {
      let imageUrl = item?.image_url
      let imagePath = item?.image_path

      // Upload new image if selected
      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage.uri)
        imageUrl = uploadResult.publicUrl
        imagePath = uploadResult.path
      }

      const updates = {
        ...input,
        image_url: imageUrl,
        image_path: imagePath,
      }

      updateItem(
        {
          id: item?.id,
          updates,
        },
        {
          onSuccess: () => {
            setIsEditing(false)
            setSelectedImage(null)
          },
        },
      )
    } catch (error: any) {
      console.log(error.message)
    }
  }

  function handleConfirmDelete() {
    setDeleteError(null)

    deleteItem(
      { id: item?.id, image_path: item?.image_path },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          router.back()
        },
        onError: (err) => setDeleteError(err.message),
      },
    )
  }

  const isLowStock = item.quantity <= 10
  const hasCategory = !!item.categories?.name

  // Shared header component
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (isEditing) {
            setIsEditing(false)
            setSelectedImage(null)
          } else {
            router.back()
          }
        }}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Item" : "Item Details"}
        </Text>
        {isEditing && (
          <View style={styles.editingBadge}>
            <Text style={styles.editingBadgeText}>Editing</Text>
          </View>
        )}
        {!isEditing && isLowStock && (
          <View style={styles.lowStockBadge}>
            <Ionicons name="alert" size={12} color="#DC2626" />
            <Text style={styles.lowStockBadgeText}>Low Stock</Text>
          </View>
        )}
      </View>

      <View style={{ width: 40 }} />
    </View>
  )

  return (
    <ScreenContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* HEADER - Always visible */}
      <Header />

      {isEditing ? (
        // EDITING MODE - With Keyboard Awareness
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
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
              image={selectedImage?.uri ?? item.image_url}
              onChange={setSelectedImage}
              title="Item Image"
              disabled={isUpdating}
            />

            <InventoryForm
              initialValues={{
                name: item.name,
                description: item?.description || "",
                quantity: String(item.quantity),
                price: String(item.price),
                category: String(item.categories?.id),
              }}
              submitLabel="Save Changes"
              submitting={isUpdating}
              onSubmit={handleUpdate}
            />

            {/* Cancel button when editing */}
            <TouchableOpacity
              style={styles.cancelEditButton}
              onPress={() => {
                setIsEditing(false)
                setSelectedImage(null)
              }}
              disabled={isUpdating}
            >
              <Text style={styles.cancelEditText}>Cancel Editing</Text>
            </TouchableOpacity>

            {updateError && (
              <View style={styles.inlineErrorBar}>
                <Text style={styles.inlineErrorText}>
                  {updateError.message}
                </Text>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      ) : (
        // VIEW MODE - Modern Design
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE CARD */}
          <View style={styles.imageCard}>
            <Image
              source={{ uri: item.image_url ?? undefined }}
              style={styles.image}
              resizeMode="cover"
            />
            {isLowStock && (
              <View style={styles.imageLowStockOverlay}>
                <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
                <Text style={styles.imageLowStockText}>Low Stock</Text>
              </View>
            )}
          </View>

          {/* NAME & PRICE ROW */}
          <View style={styles.namePriceRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {isLowStock && (
                <View style={styles.lowStockIndicator}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.lowStockIndicatorText}>Low Stock</Text>
                </View>
              )}
            </View>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          </View>

          {/* CATEGORY CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.infoCardLabel}>Category</Text>
            </View>
            {hasCategory ? (
              <View style={styles.categoryContainer}>
                <View style={styles.categoryBadge}>
                  <Ionicons
                    name="folder-outline"
                    size={14}
                    color="#1D4ED8"
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryText}>
                    {item?.categories?.name}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noCategoryText}>No category assigned</Text>
            )}
          </View>

          {/* QUANTITY CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons
                name="cube-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.infoCardLabel}>Quantity</Text>
            </View>
            <View style={styles.quantityRow}>
              <Text style={styles.infoCardValue}>{item.quantity}</Text>
              {isLowStock && (
                <View style={styles.lowStockPill}>
                  <Text style={styles.lowStockPillText}>Low Stock</Text>
                </View>
              )}
            </View>
            {isLowStock && (
              <Text style={styles.lowStockWarning}>
                ⚠️ This item has {item.quantity} units remaining. Consider
                restocking soon.
              </Text>
            )}
          </View>

          {/* DESCRIPTION CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.infoCardLabel}>Description</Text>
            </View>
            <Text style={styles.description}>
              {item.description || "No description provided"}
            </Text>
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button
                title="Edit Item"
                onPress={() => setIsEditing(true)}
                variant="secondary"
                icon={
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={colors.primary}
                  />
                }
              />
            </View>

            <View style={styles.actionButton}>
              <Button
                title="Delete"
                onPress={() => setIsDeleteDialogOpen(true)}
                variant="danger"
                icon={
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.white}
                  />
                }
              />
            </View>
          </View>
        </ScrollView>
      )}

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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? spacing.md : spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    minHeight: Platform.OS === "ios" ? 60 : 70,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  editingBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  editingBadgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  lowStockBadgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  editContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  // Image Card
  imageCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.borderLight,
    marginBottom: spacing.lg,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 260,
  },
  imageLowStockOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(220, 38, 38, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageLowStockText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Name & Price
  namePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  lowStockIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lowStockIndicatorText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: "#DC2626",
  },
  price: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  // Info Cards
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.sm,
  },
  infoCardLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  // Category Styles
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignSelf: "flex-start",
    gap: 6,
  },
  categoryIcon: {
    marginRight: 2,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: "#1D4ED8",
  },
  noCategoryText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lowStockPill: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lowStockPillText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  lowStockWarning: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: "#DC2626",
    lineHeight: 18,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
    fontFamily: fonts.regular,
  },
  // Actions
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
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
  bottomSpacer: {
    height: 100,
  },
  cancelEditButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  cancelEditText: {
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
})
