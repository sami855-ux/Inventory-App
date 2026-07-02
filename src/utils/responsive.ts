import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export const isTablet = width >= 768

// Used by the inventory list to switch from 1 column (phone) to a grid (tablet)
export const listColumns = isTablet ? 2 : 1

// Caps content width on large screens so text/forms don't stretch edge to edge
export const maxContentWidth = 640

export function responsiveHorizontalPadding(): number {
  return isTablet ? 32 : 16
}
