import { queryClient } from "@/src/lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"

import "../global.css"

// Prevent splash from auto-hiding (safe version)
SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter_18pt-Bold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // Keep splash visible until fonts are ready
  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Inventory",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="item/create/index"
          options={{
            title: "Add Item",
            presentation: "modal",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="item/[id]"
          options={{
            title: "Item Details",
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
