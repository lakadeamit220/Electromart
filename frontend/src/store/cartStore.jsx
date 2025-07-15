import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item._id === product._id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
