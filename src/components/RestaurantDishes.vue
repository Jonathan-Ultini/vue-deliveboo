<template>
  <div class="restaurant-dishes container">
    <h1 class="title text-center my-4">Piatti di {{ restaurant.name }}</h1>

    <div v-if="loading" class="loading text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>
    <div v-else-if="error" class="error text-danger text-center">
      Errore: {{ error }}
    </div>

    <div v-else class="row">
      <!-- Colonna per i piatti -->
      <div class="col-md-8">
        <div v-if="dishes.length > 0">
          <div v-for="dish in dishes" :key="dish.id" class="card mb-3">
            <div class="row g-0 align-items-center">
              <div class="col-md-4">
                <img v-if="dish.image_url" :src="`http://localhost:8000` + dish.image_url" alt="Immagine del piatto"
                  class="img-fluid rounded-start" />
                <div v-else class="placeholder-image d-flex align-items-center justify-content-center">
                  Nessuna immagine
                </div>
              </div>
              <div class="col-md-8">
                <div class="card-body d-flex flex-column justify-content-between h-100">
                  <div>
                    <h3 class="card-title">{{ dish.name }}</h3>
                    <p class="card-description">{{ dish.description }}</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <p class="card-price mb-0">
                      <strong>Prezzo:</strong> {{ dish.price }} €
                    </p>
                    <!-- Mostra il numero di ordini per questo piatto -->
                    <p v-if="getDishQuantity(dish.id) > 0">
                      Ordini: {{ getDishQuantity(dish.id) }}
                    </p>
                    <button class="btn btn-primary btn-sm" @click="addDishToCart(dish)">
                      <i class="bi bi-plus"></i> Aggiungi al carrello
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-dishes text-center">
          <p class="text-danger fs-4 fw-bold">Nessun piatto trovato.</p>
        </div>
      </div>

      <!-- Colonna per il carrello -->
      <div class="col-md-4">
        <div class="">
          <h2 class="text-center">Carrello</h2>
          <div v-if="cartItems.length > 0">
            <ul class="list-group mb-3">
              <li v-for="item in cartItems" :key="item.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {{ item.name }} (x{{ item.quantity }})
                </span>
                <strong>{{ (item.price * item.quantity).toFixed(2) }} €</strong>
              </li>
            </ul>
            <div class="text-center">
              <p class="fw-bold">Totale: {{ cartTotal }} €</p>
              <button class="btn btn-success btn-sm" @click="checkout">Checkout</button>
            </div>
          </div>
          <div v-else>
            <p class="text-center text-muted">Il carrello è vuoto.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cartStore";
import axios from "axios";

export default {
  name: "RestaurantDishes",
  data() {
    return {
      dishes: [], // Lista dei piatti del ristorante
      restaurant: {}, // Informazioni sul ristorante
      loading: true, // Stato di caricamento
      error: null, // Gestione errori
    };
  },
  computed: {
    // Ottieni gli articoli nel carrello dal CartStore
    cartItems() {
      const cartStore = useCartStore();
      return cartStore.items;
    },
    // Calcola il totale del carrello
    cartTotal() {
      const cartStore = useCartStore();
      return cartStore.cartTotal;
    },
  },
  async mounted() {
    this.fetchRestaurantDishes();
  },
  methods: {
    // Ottieni i dati dei piatti e del ristorante
    async fetchRestaurantDishes() {
      try {
        const restaurantId = this.$route.params.id;

        // Richiesta per ottenere i piatti
        const response = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}/dishes`
        );
        this.dishes = response.data.results;

        // Richiesta per ottenere le informazioni sul ristorante
        const restaurantResponse = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}`
        );
        this.restaurant = restaurantResponse.data.results;

        this.loading = false;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.$router.push({ name: "not-found" }); // Reindirizza a una pagina di errore se il ristorante non esiste
        } else {
          this.error = "Errore durante il caricamento dei dati.";
        }
      }
    },
    // Aggiungi un piatto al carrello
    addDishToCart(dish) {
      const cartStore = useCartStore();
      cartStore.addDish(dish, this.restaurant); // Associa il piatto al ristorante
    },
    // Procedi al checkout
    checkout() {
      const cartStore = useCartStore();

      if (!cartStore.items.length) {
        alert("Il carrello è vuoto. Aggiungi alcuni piatti prima di procedere al checkout.");
        return;
      }

      // Naviga alla pagina di checkout dal componente Vue
      this.$router.push({ name: "checkout" });
    },
    // Ottieni la quantità di un piatto specifico nel carrello
    getDishQuantity(dishId) {
      const cartStore = useCartStore();
      return cartStore.getDishQuantity(dishId);
    },
  },
};
</script>



<style scoped>
.restaurant-dishes {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.card-body {
  padding: 16px;
}

.img-fluid {
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  height: 150px;
  background-color: #f8f9fa;
  color: #6c757d;
  font-size: 1rem;
  text-align: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-description {
  font-size: 0.9rem;
  color: #6c757d;
}

.card-price {
  font-size: 1rem;
  font-weight: bold;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>