// store/cartStore.ts
import { create } from "zustand";

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItemLocal: (item: CartItem) => void;
  updateItemLocal: (product_id: number, quantity: number) => void;
  removeItemLocal: (product_id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItemLocal: (item) => {
    const exists = get().items.find((i) => i.product_id === item.product_id);
    if (exists) {
      set({
        items: get().items.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },
  updateItemLocal: (product_id, quantity) =>
    set({
      items: get().items.map((i) =>
        i.product_id === product_id ? { ...i, quantity } : i
      ),
    }),
  removeItemLocal: (product_id) =>
    set({ items: get().items.filter((i) => i.product_id !== product_id) }),
  clearCart: () => set({ items: [] }),
}));
