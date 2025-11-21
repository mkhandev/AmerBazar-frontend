import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string("Invalid phone"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
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

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  // category: z.union([
  //   z.number().min(1, "Select at least one category"),
  //   z.string().min(1, "Select at least one category"),
  // ]),
  category_id: z.coerce.number().min(1, "Select at least one category"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  stock: z.coerce.number().gt(0, "Stock must be greater than 0"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  images: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required"),
});

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required"),
});
