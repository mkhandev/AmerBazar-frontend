import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const shippingAddressSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().optional(),
  address: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postal_code: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  payment_method: z.enum(["cod", "stripe"], {
    error: "Payment method must be CashOnDelivery or Stripe",
  }),
});
