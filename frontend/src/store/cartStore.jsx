import { create } from 'zustand';
import { toast } from 'react-toastify';

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item._id === product._id);
      toast.success(`${product.name} added to cart!`);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId, productName) =>
    set((state) => {
      toast.info(`${productName} removed from cart`);
      return { cart: state.cart.filter((item) => item._id !== productId) };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    })),
  clearCart: () =>
    set(() => {
      toast.info('Cart cleared');
      return { cart: [] };
    }),
}));

export default useCartStore;