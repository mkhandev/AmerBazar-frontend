import { shippingAddressSchema } from "@/lib/validators";
import z from "zod";

export const API_LOCAL_URL =
  process.env.LOCAL_API_URL || "http://127.0.0.1:8000/api/v1";

export const API_SERVER_URL =
  process.env.SERVER_API_URL || "https://api.amerbazar.mkhandev.info/api/v1";

export const apiUrl =
  process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === "production"
    ? API_SERVER_URL
    : API_LOCAL_URL;

export const SERVER_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === "production"
    ? "https://amer-bazar.vercel.app"
    : "http://127.0.0.1:3000";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "AmerBazar";

export const PRICES = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
];

export const RATINGS = [4, 3, 2, 1];

export const SORT_ORDERS = ["newest", "lowest", "highest", "rating"];

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "password",
};

export const signUpDefaultValues = {
  name: "Sumon",
  email: "mkhancse@gmail.com",
  password: "123456",
  confirmPassword: "123456",
};

export const shippingAddressDefaultValues: z.infer<
  typeof shippingAddressSchema
> = {
  name: "Abdullah Al Mahmud",
  phone: "01748152992",
  address: "123 Main st",
  city: "Dhaka",
  postal_code: "1216",
  country: "Bangladesh",
  payment_method: "cod",
};

export const shippingAmount = 50.0;
export const taxAmount = 0;
