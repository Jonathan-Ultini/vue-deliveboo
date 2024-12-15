import { defineStore } from 'pinia';
import axios from 'axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Articoli nel carrello
    restaurantName: null, // Nome del ristorante
    restaurantAddress: null, // Indirizzo del ristorante
    restaurantId: null,
  }),
  getters: {
    //Ottieni prezzo totale
    cartTotal: (state) => {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    },
    //Ottieni numero piatti
    totalItem: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    // Ottieni la quantità di ordini per un piatto specifico
    getDishQuantity: (state) => {
      return (dishId) => {
        const dish = state.items.find((item) => item.id === dishId);
        return dish ? dish.quantity : 0; // Se il piatto non esiste, ritorna 0
      };
    },
  },
  actions: {
    //=========================================================cartsidebar=====================
    addItem(item, restaurant) {
      // Controlla se il carrello ha già un ristorante
      if (this.restaurantId && this.restaurantId !== restaurant.id) {
        const confirmReset = confirm(
          "Vuoi resettare il carrello per aggiungere piatti da un altro ristorante?"
        );
        if (!confirmReset) return;

        // Resetta il carrello per accettare piatti dal nuovo ristorante
        this.items = [];
        this.restaurantId = restaurant.id;
        this.restaurantName = restaurant.name;
        this.restaurantAddress = restaurant.address;
      }

      // Aggiungi o aggiorna il piatto
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }

      // Se il carrello è vuoto, imposta il ristorante
      if (!this.restaurantId) {
        this.restaurantId = restaurant.id;
        this.restaurantName = restaurant.name;
        this.restaurantAddress = restaurant.address;
      }
    },
    updateQuantity(item, delta) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += delta;
        if (existingItem.quantity <= 0) {
          this.removeItem(item);
        }
      }
    },
    removeItem(item) {
      const index = this.items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    clearCart() {
      this.items = [];
      this.restaurantName = null;
      this.restaurantAddress = null;
    },
    async checkout() {
      if (!this.items.length) {
        alert('Il carrello è vuoto. Aggiungi alcuni piatti prima di procedere al checkout.');
        return;
      }
      try {
        // Recupera il nome e l'indirizzo del ristorante
        const dishId = this.items[0].id;
        const dishResponse = await axios.get(`http://localhost:8000/api/dishes/${dishId}`);
        const restaurantId = dishResponse.data.restaurant_id;
        const restaurantResponse = await axios.get(`http://localhost:8000/api/restaurants/${restaurantId}`);
        this.restaurantName = restaurantResponse.data.results.name;
        this.restaurantAddress = restaurantResponse.data.results.address;
      } catch (error) {
        console.error('Errore nel checkout:', error);
      }
    },


    //=========================================================restaurantdishes=====================

    addDish(dish, restaurant) {
      // Controlla se il ristorante è diverso
      if (this.restaurantId && this.restaurantId !== restaurant.id) {
        const confirmReset = confirm(
          "Vuoi resettare il carrello per aggiungere piatti da un altro ristorante?"
        );
        if (!confirmReset) return;

        // Resetta il carrello
        this.resetCart();
        this.setRestaurant(restaurant);
      } else if (!this.restaurantId) {
        this.setRestaurant(restaurant);
      }

      // Aggiungi il piatto al carrello
      const existingItem = this.items.find((item) => item.id === dish.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.unshift({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image_url,
          quantity: 1,
        });
      }
    },
    removeDish(dishId) {
      this.items = this.items.filter((item) => item.id !== dishId);
    },
    resetCart() {
      this.restaurantId = null;
      this.restaurantName = null;
      this.restaurantAddress = null;
      this.items = [];
    },
    setRestaurant(restaurant) {
      this.restaurantId = restaurant.id;
      this.restaurantName = restaurant.name;
      this.restaurantAddress = restaurant.address;
    },
  },
  persist: true, // Attiva la persistenza
});
