import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { fonts } from "@/src/lib/theme"
import type { LocalImage } from "@/src/types/inventory"

type ImageUploaderProps = {
  image: string | null
  onChange: (image: LocalImage | null) => void
  title?: string
  disabled?: boolean
}

export default function ImageUploader({
  image,
  onChange,
  title = "Upload Image",
  disabled = false,
}: ImageUploaderProps) {
  const [visible, setVisible] = useState(false)
  console.log(image)

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      alert("Gallery permission is required.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    setVisible(false)

    if (result.canceled) return

    const asset = result.assets[0]

    onChange({
      uri: asset.uri,
      fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? "image/jpeg",
    })
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()

    if (!permission.granted) {
      alert("Camera permission is required.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    setVisible(false)

    if (result.canceled) return

    const asset = result.assets[0]

    onChange({
      uri: asset.uri,
      fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? "image/jpeg",
    })
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={styles.container}
        onPress={() => setVisible(true)}
      >
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            {/* Overlay with text and icon when image is present */}
            <View style={styles.imageOverlay}>
              <View style={styles.overlayContent}>
                <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                <Text style={styles.overlayText}>
                  Tap to edit or upload image
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="camera-outline" size={42} color="#6B7280" />
            <Text style={styles.title}>{title}</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            {/* Drag handle for iOS style */}
            <View style={styles.dragHandle} />

            <Text style={styles.modalTitle}>Select Image</Text>

            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Ionicons
                name="camera"
                size={20}
                color="#374151"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
              <Ionicons
                name="images"
                size={20}
                color="#374151"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 8,
  },

  // Overlay that appears on top of the image
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  overlayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  overlayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: fonts.medium,
    letterSpacing: 0.3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 34,
  },

  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "#1F2937",
    fontFamily: fonts.bold,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
  },

  buttonIcon: {
    marginRight: 8,
  },

  buttonText: {
    fontSize: 16,
    color: "#374151",
    fontFamily: fonts.regular,
  },

  removeButton: {
    backgroundColor: "#FEE2E2",
  },

  removeText: {
    color: "#DC2626",
    fontSize: 16,
    fontFamily: fonts.regular,
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
    marginBottom: 0,
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
})
