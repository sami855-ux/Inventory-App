import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, Text, View } from "react-native"

import Button from "@/src/components/ui/Button"
import Input from "@/src/components/ui/Input"
import { colors, fonts, radius, spacing } from "@/src/lib/theme"

import type { InventoryItemInput } from "@/src/types/inventory"
import {
  inventorySchema,
  type InventoryFormSchema,
} from "@/src/types/inventory.schema"

interface InventoryFormProps {
  initialValues?: InventoryFormSchema
  submitLabel: string
  submitting: boolean
  onSubmit: (input: InventoryItemInput) => void
}

const emptyValues: InventoryFormSchema = {
  name: "",
  description: "",
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
  } = useForm<InventoryFormSchema>({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialValues,
  })

  function submitHandler(data: InventoryFormSchema) {
    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
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
  content: {
    padding: spacing.lg,
    // paddingBottom: spacing.xxl + spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
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
  submitWrapper: {
    marginTop: spacing.sm,
  },
})
