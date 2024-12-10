export default {
  data() {
    return {
      cart: this.loadCartFromLocalStorage(),
      restaurantId: null, // L'ID del ristorante corrente
    };
  },
  methods: {
    // Carica il carrello dal Local Storage
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : [];
    },

    // Salva il carrello nel Local Storage
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Aggiunge un piatto al carrello
    addToCart(dish, restaurantId) {
      if (this.restaurantId && this.restaurantId !== restaurantId) {
        // Se il carrello appartiene a un altro ristorante, chiedi conferma
        if (
          !confirm(
            "Hai piatti di un altro ristorante nel carrello. Vuoi svuotarlo per aggiungere questo piatto?"
          )
        ) {
          return;
        }
        // Svuota il carrello se confermato
        this.clearCart();
      }

      this.restaurantId = restaurantId;

      // Aggiunge il piatto al carrello
      const existingDish = this.cart.find((item) => item.id === dish.id);
      if (existingDish) {
        existingDish.quantity++;
      } else {
        this.cart.push({ ...dish, quantity: 1 });
      }

      this.saveCartToLocalStorage();
    },

    // Svuota il carrello
    clearCart() {
      this.cart = [];
      this.restaurantId = null;
      this.saveCartToLocalStorage();
    },

    // Rimuove un elemento dal carrello
    removeFromCart(dishId) {
      this.cart = this.cart.filter((item) => item.id !== dishId);
      if (this.cart.length === 0) {
        this.restaurantId = null;
      }
      this.saveCartToLocalStorage();
    },

    // Ottiene il totale del carrello
    getTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
};
