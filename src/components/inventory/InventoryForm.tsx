import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, Text, View } from "react-native"

import { ImagePickerField } from "@/src/components/inventory/ImagePickerField"
import Button from "@/src/components/ui/Button"
import Input from "@/src/components/ui/Input"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"

import type { InventoryItemInput, LocalImage } from "@/src/types/inventory"
import {
  inventorySchema,
  type InventoryFormSchema,
} from "@/src/types/inventory.schema"
import { pickImage } from "@/src/utils/pickImage"
import { useState } from "react"

interface InventoryFormProps {
  initialValues?: InventoryFormSchema
  initialImageUrl?: string | null
  submitLabel: string
  submitting: boolean
  onSubmit: (input: InventoryItemInput, newImage: LocalImage | null) => void
}

const emptyValues: InventoryFormSchema = {
  name: "",
  description: "",
  quantity: "",
  price: "",
}

export function InventoryForm({
  initialValues = emptyValues,
  initialImageUrl,
  submitLabel,
  submitting,
  onSubmit,
}: InventoryFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialValues,
  })

  const [localImage, setLocalImage] = useState<LocalImage | null>(null)

  const previewUri = localImage?.uri ?? initialImageUrl ?? null

  async function handlePickImage() {
    try {
      const image = await pickImage()
      if (image) {
        setLocalImage(image)
        clearErrors("name") // optional cleanup hook-style
      }
    } catch (err) {
      setError("name", {
        message: err instanceof Error ? err.message : "Image error",
      })
    }
  }

  const submitHandler = (data: InventoryFormSchema) => {
    if (!previewUri) {
      return
    }

    onSubmit(
      {
        name: data.name.trim(),
        description: data.description.trim(),
        quantity: Number(data.quantity),
        price: Number(data.price),
      },
      localImage,
    )
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* IMAGE */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Photo</Text>
        <ImagePickerField uri={previewUri} onPick={handlePickImage} />
      </View>

      {/* FORM */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Details</Text>

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Name"
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
                placeholder="Short description"
                multiline
                numberOfLines={3}
                style={styles.textArea}
                error={errors.description?.message}
              />
            )}
          />

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
      </View>

      {/* SUBMIT */}
      <View style={styles.submitWrapper}>
        <Button
          title={submitLabel}
          onPress={handleSubmit(submitHandler)}
          loading={submitting}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: spacing.sm + 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
  },
  textArea: { minHeight: 80, textAlignVertical: "top", paddingTop: spacing.md },
  row: { flexDirection: "row", gap: spacing.md },
  rowItem: { flex: 1 },
  submitWrapper: { marginTop: spacing.sm },
})
