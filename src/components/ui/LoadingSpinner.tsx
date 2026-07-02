import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  label?: string
}

export default function LoadingSpinner({
  size = "large",
  label,
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#111" />

      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  label: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
})
