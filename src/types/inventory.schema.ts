import { z } from "zod"

export const inventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number"),
  category: z.string(),
})

export type InventoryFormSchema = z.infer<typeof inventorySchema>
