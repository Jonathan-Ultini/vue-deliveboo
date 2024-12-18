export default {
  data() {
    return {
      cart: this.loadCartFromLocalStorage(),
      restaurantId: this.loadRestaurantIdFromLocalStorage(),
      restaurantName: this.loadRestaurantNameFromLocalStorage(), // Aggiunto per salvare il nome
      restaurantAddress: this.loadRestaurantAddressFromLocalStorage(),
    };
  },
  methods: {
    // Carica il carrello dal Local Storage
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : [];
    },

    // Carica l'ID del ristorante dal Local Storage
    loadRestaurantIdFromLocalStorage() {
      return localStorage.getItem("restaurantId") || null;
    },

    // Carica il nome del ristorante dal Local Storage
    loadRestaurantNameFromLocalStorage() {
      return localStorage.getItem("restaurantName") || null;
    },

    // Carica l'indirizzo del ristorante dal Local Storage
    loadRestaurantAddressFromLocalStorage() {
      return localStorage.getItem("restaurantAddress") || null;
    },

    // Salva il carrello nel Local Storage
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Salva l'ID, il nome e indirizzo del ristorante nel Local Storage
    saveRestaurantToLocalStorage(restaurantId, restaurantName, restaurantAddress) {
      localStorage.setItem("restaurantId", restaurantId);
      localStorage.setItem("restaurantName", restaurantName);
      localStorage.setItem("restaurantAddress", restaurantAddress);
    },

    // Aggiunge un piatto al carrello
    addToCart(dish, restaurantId) {
      // Se c'è un ristorante diverso nel carrello, conferma con l'utente
      if (this.restaurantId && this.restaurantId !== restaurantId) {
        if (
          !confirm(
            "Hai piatti di un altro ristorante nel carrello. Vuoi svuotarlo per aggiungere questo piatto?"
          )
        ) {
          return;
        }
        this.clearCart();
      }

      // Recupera i dati del ristorante se non sono già salvati
      if (!this.restaurantId || this.restaurantId !== restaurantId) {
        axios
          .get(`http://localhost:8000/api/restaurants/${restaurantId}`)
          .then((response) => {
            const restaurantData = response.data.results;
            this.restaurantId = restaurantId;
            this.restaurantName = restaurantData.name;
            this.restaurantAddress = restaurantData.address;

            // Salva i dati del ristorante nel Local Storage
            this.saveRestaurantToLocalStorage(
              restaurantId,
              restaurantData.name,
              restaurantData.address
            );

            // Procedi con l'aggiunta del piatto
            this.addDishToCart(dish);
          })
          .catch((error) => {
            console.error("Errore nel recupero dei dati del ristorante:", error);
          });
      } else {
        // Se i dati del ristorante sono già salvati, aggiungi il piatto
        this.addDishToCart(dish);
      }
    },

    addDishToCart(dish) {
      const existingDish = this.cart.find((item) => item.id === dish.id);
      if (existingDish) {
        existingDish.quantity++;
      } else {
        this.cart.push({ ...dish, quantity: 1 });
      }

      // Salva il carrello nel Local Storage
      this.saveCartToLocalStorage();
    },

    clearCart() {
      this.cart = [];
      this.restaurantId = null;
      this.restaurantName = null;
      localStorage.removeItem("restaurantId");
      localStorage.removeItem("restaurantName");
      localStorage.removeItem("restaurantAddress");
      this.saveCartToLocalStorage();
    },
  },
};
