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
            console.log('Computed Total:', totalSum.toFixed(2)); // Log del totale
            return totalSum.toFixed(2);
        },
        itemCount: (state) => {
            console.log('Item Count:', state.cart.items.length); // Log del conteggio
            return state.cart.items.length;
        },
    }, actions: {

    },
});



