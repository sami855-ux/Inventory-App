import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import Button from "@/src/components/ui/Button"
import Input from "@/src/components/ui/Input"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"

import { useCategories } from "@/src/hooks/useCategories"
import type { InventoryItemInput } from "@/src/types/inventory"
import {
  inventorySchema,
  type InventoryFormSchema,
} from "@/src/types/inventory.schema"
import LoadingSpinner from "../ui/LoadingSpinner"

interface InventoryFormProps {
  initialValues?: Partial<InventoryFormSchema>
  submitLabel: string
  submitting: boolean
  onSubmit: (input: InventoryItemInput) => void
}

const emptyValues: InventoryFormSchema = {
  name: "",
  description: "",
  category: "",
  quantity: "",
  price: "",
}

export function InventoryForm({
  initialValues = emptyValues,
  submitLabel,
  submitting,
  onSubmit,
}: InventoryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      ...emptyValues,
      ...initialValues,
    },
  })

  console.log(initialValues)
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error,
  } = useCategories()

  // Watch the category value to track changes
  const selectedCategory = watch("category")

  function submitHandler(data: InventoryFormSchema) {
    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category?.trim() || "",
      quantity: Number(data.quantity),
      price: Number(data.price),
    })
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Basic Information</Text>
        </View>

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Item Name"
                value={value}
                onChangeText={onChange}
                placeholder="e.g. Wireless Mouse"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Description"
                value={value}
                onChangeText={onChange}
                placeholder="Brief description of the item"
                multiline
                numberOfLines={3}
                style={styles.textArea}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Category</Text>

                {loadingCategories ? (
                  <LoadingSpinner size="small" label="Loading categories..." />
                ) : error ? (
                  <Text style={styles.errorText}>
                    Failed to load categories
                  </Text>
                ) : (
                  <View style={styles.categoryGrid}>
                    {categories.map((category, index) => {
                      const isActive = String(value) === String(category.id)

                      return (
                        <Animated.View
                          key={category.id}
                          entering={FadeInDown.delay(
                            150 + index * 50,
                          ).springify()}
                        >
                          <Button
                            title={category.name}
                            onPress={() => {
                              onChange(category.id)
                            }}
                            variant={isActive ? "primary" : "secondary"}
                            style={
                              isActive
                                ? styles.categoryButtonActive
                                : styles.categoryButton
                            }
                          />
                        </Animated.View>
                      )
                    })}
                  </View>
                )}

                {errors.category?.message && (
                  <Text style={styles.errorText}>
                    {errors.category.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Pricing & Stock</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Quantity"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    placeholder="0"
                    error={errors.quantity?.message}
                  />
                )}
              />
            </View>

            <View style={styles.rowItem}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Price"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    error={errors.price?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.submitWrapper}
      >
        <Button
          title={submitLabel}
          onPress={handleSubmit(submitHandler)}
          loading={submitting}
          style={styles.submitButton}
        />
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  categoryButton: {
    marginBottom: spacing.sm,
    minWidth: 80,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryButtonActive: {
    marginBottom: spacing.sm,
    minWidth: 80,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.surface,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  sectionBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
  },
  sectionBadgeSecondary: {
    backgroundColor: colors.background,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    shadowColor: colors.textMuted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  categoryContainer: {
    marginTop: spacing.xs,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  submitWrapper: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  submitButton: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
  },
})
