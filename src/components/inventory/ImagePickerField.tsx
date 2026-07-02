import { colors, radius, spacing } from "@/src/lib/theme"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface ImagePickerFieldProps {
  uri: string | null
  onPick: () => void
  error?: string
}

export function ImagePickerField({
  uri,
  onPick,
  error,
}: ImagePickerFieldProps) {
  return (
    <View>
      <TouchableOpacity onPress={onPick} style={styles.container}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    marginTop: spacing.xs,
    color: "red",
    fontSize: 12,
  },
})
