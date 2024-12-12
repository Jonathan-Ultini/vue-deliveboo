import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: JSON.parse(localStorage.getItem('cart')) || {
            restaurantId: null,
            items: []
        },
    }),

    getters: {
        total: (state) => {
            let totalSum = 0;
            for (const item of state.cart.items) {
                totalSum += item.price * item.quantity;
            }
            console.log('Computed Total:', totalSum.toFixed(2));
            return totalSum.toFixed(2);
        },
        itemCount: (state) => {
            console.log('Item Count:', state.cart.items.length);
            return state.cart.items.length;
        },
    }, actions: {
        loadCart() {
            const savedCart = localStorage.getItem('cart');
            this.cart = savedCart ? JSON.parse(savedCart) : { restaurantId: null, items: [] };
            console.log('Cart Loaded:', this.cart);
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            console.log('Cart Saved:', this.cart);
        },
    },
});



