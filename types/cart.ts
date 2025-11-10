export type CartItem = {
  product_id: number;
  price: number;
  quantity: number;
};

export type ShippingInfo = {
  name: string;
  phone?: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  payment_method: "CashOnDelivery" | "Stripe";
};
