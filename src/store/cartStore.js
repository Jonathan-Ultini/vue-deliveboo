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
    }, actions: {
        toggleCartSidebar() {
            this.showCart = !this.showCart;
        },
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
        }, removeFromCart(dishId) {
            console.log('Removing Dish ID:', dishId);

            this.cart.items = this.cart.items.filter((item) => item.id !== dishId);
            if (!this.cart.items.length) this.cart.restaurantId = null;

            console.log('Cart After Removal:', this.cart);
            this.saveCart();
        },

        clearCart() {
            console.log('Clearing Cart');
            this.cart = { restaurantId: null, items: [] };
            console.log('Cart After Clearing:', this.cart);
            this.saveCart();
        },
    },
});



