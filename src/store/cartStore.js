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
        addToCart(dish, restaurantId) {
            console.log('Adding Dish:', dish, 'Restaurant ID:', restaurantId);

            if (this.cart.restaurantId && this.cart.restaurantId !== restaurantId) {
                const confirmClear = confirm('Hai piatti di un altro ristorante nel carrello. Vuoi svuotarlo?');
                if (!confirmClear) {
                    console.log('Add to Cart Aborted: Different Restaurant');
                    return;
                }
                this.clearCart();
            }

            this.cart.restaurantId = restaurantId;

            const existingItem = this.cart.items.find((item) => item.id === dish.id);
            if (existingItem) {
                existingItem.quantity++;
                console.log('Updated Dish Quantity:', existingItem);
            } else {
                const newItem = { id: dish.id, name: dish.name, price: dish.price, quantity: 1 };
                this.cart.items.push(newItem);
                console.log('New Dish Added:', newItem);
            }

            this.saveCart();
        },
    },
});



