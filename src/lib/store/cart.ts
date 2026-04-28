import { create } from "zustand";

interface CartItem {
  product_id: string;
  name: string;
  price_rp: number;
  quantity: number;
  image_url: string;
  stock_qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.product_id === item.product_id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock_qty) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product_id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === productId
          ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock_qty)) }
          : i
      ).filter((i) => i.quantity > 0),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price_rp * i.quantity, 0),
}));
