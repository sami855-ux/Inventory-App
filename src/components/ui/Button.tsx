import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary" | "danger"
  style?: ViewStyle

  // ✨ NEW
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const backgroundColor = {
    primary: "#2563EB",
    secondary: "#6B7280",
    danger: "#DC2626",
  }[variant]

  const isDisabled = disabled || loading

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.content}>
          {/* LEFT ICON */}
          {icon && iconPosition === "left" && (
            <View style={styles.icon}>{icon}</View>
          )}

          <Text style={styles.text}>{title}</Text>

          {/* RIGHT ICON */}
          {icon && iconPosition === "right" && (
            <View style={styles.icon}>{icon}</View>
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  icon: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },

  disabled: {
    opacity: 0.6,
  },

  pressed: {
    opacity: 0.8,
  },
})
