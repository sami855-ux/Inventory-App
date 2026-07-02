import { fonts } from "@/src/lib/theme"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        {...props}
        style={[styles.input, error && styles.errorBorder]}
        placeholderTextColor="#999"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    color: "#111827",
    fontFamily: fonts.medium,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.medium,
    backgroundColor: "#fff",
  },

  errorBorder: {
    borderColor: "#DC2626",
  },

  error: {
    marginTop: 5,
    color: "#DC2626",
    fontSize: 13,
  },
})
