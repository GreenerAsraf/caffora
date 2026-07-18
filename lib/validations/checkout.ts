import { z } from "zod"

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Enter the recipient's full name."),
  street: z.string().min(5, "Enter a complete street address."),
  city: z.string().min(2, "Enter a city."),
  state: z.string().min(2, "Enter a state or region."),
  country: z.string().min(2, "Enter a country."),
  zip: z.string().min(4, "Enter a postal code."),
  phone: z.string().min(7, "Enter a reachable phone number.").optional().or(z.literal("")),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
