import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find(item => item._id === product._id);

                if (existingItem) {
                    if (existingItem.quantity >= product.stock) {
                        toast.error('Cannot add more of this item');
                        return;
                    }
                    set({
                        items: items.map(item =>
                            item._id === product._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    });
                } else {
                    set({
                        items: [...items, { ...product, quantity: 1 }]
                    });
                }
                toast.success('Item added to cart');
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item._id !== productId)
                }));
                toast.success('Item removed from cart');
            },

            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item._id === productId
                            ? { ...item, quantity }
                            : item
                    )
                }));
            },

            clearCart: () => {
                set({ items: [] });
                toast.success('Cart cleared');
            },

            getCartTotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.discountPrice || item.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },

            getItemQuantity: (productId) => {
                const item = get().items.find((item) => item._id === productId);
                return item ? item.quantity : 0;
            }
        }),
        {
            name: 'cart-storage',
        }
    )
); 