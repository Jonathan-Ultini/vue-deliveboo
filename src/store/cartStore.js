import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        showCart: false,
        cart: {
            restaurantId: null,
            items: [],
        },
    }),

    getters: {
        itemCount: (state) => {
            return state.cart.items.reduce((count, item) => count + item.quantity, 0);
        },
        sortedItems: (state) => {
            return state.cart.items;
        },
    },
    actions: {
        toggleCartSidebar() {
            this.showCart = !this.showCart;
        },
        loadCart() {
            const savedCart = localStorage.getItem('cart');
            this.cart = savedCart ? JSON.parse(savedCart) : { restaurantId: null, items: [] };
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        addToCart(dish, restaurantId) {
            if (this.cart.restaurantId && this.cart.restaurantId !== restaurantId) {
                const confirmClear = confirm('Hai piatti di un altro ristorante nel carrello. Vuoi svuotarlo per aggiungere questo piatto?');
                if (!confirmClear) return;
                this.clearCart();
            }

            this.cart.restaurantId = restaurantId;

            const existingItemIndex = this.cart.items.findIndex((item) => item.id === dish.id);

            if (existingItemIndex !== -1) {

                const existingItem = this.cart.items[existingItemIndex];
                existingItem.quantity++;

                this.cart.items.splice(existingItemIndex, 1);

                this.cart.items = [existingItem, ...this.cart.items];
            } else {
                const newItem = {
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    quantity: 1,
                    timestamp: Date.now(),
                };
                this.cart.items = [newItem, ...this.cart.items];
            }

            this.saveCart();
        },
        removeFromCart(dishId) {
            this.cart.items = this.cart.items.filter((item) => item.id !== dishId);
            if (!this.cart.items.length) this.cart.restaurantId = null;
            this.saveCart();
        },

        updateQuantity(dishId, changeAmount) {
            const item = this.cart.items.find((item) => item.id === dishId);
            if (item) {
                item.quantity += changeAmount;
                if (item.quantity <= 0) {
                    this.removeFromCart(dishId);
                } else {
                    this.saveCart();
                }
            }
        },

        clearCart() {
            this.cart = { restaurantId: null, items: [] };
            this.saveCart();
        },

        handleBeforeUnload() {
            if (this.cart.items.length > 0) {
                return 'Sei sicuro di abbandonare la sessione? Hai ancora articoli nel carrello.';
            }
        },
    },
});



