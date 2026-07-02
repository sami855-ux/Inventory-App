import { Platform, ToastAndroid } from "react-native"

type ToastType = "success" | "error" | "info"

class Toast {
  show(message: string, type: ToastType = "info") {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT)
    } else {
      // fallback for iOS (simple alert fallback)
      alert(`${type.toUpperCase()}: ${message}`)
    }
  }

  success(message: string) {
    this.show(message, "success")
  }

  error(message: string) {
    this.show(message, "error")
  }

  info(message: string) {
    this.show(message, "info")
  }
}

export default new Toast()
