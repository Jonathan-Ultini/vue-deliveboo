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

    <div v-else-if="!loading && !error" class="no-dishes text-center">
      <p class="text-danger fs-4 fw-bold">Nessun piatto trovato.</p>
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
      dishes: [],
      restaurant: {},
      loading: true,
      error: null,
    };
  },
  computed: {
    // Usa il getter per ottenere la quantità del piatto nel carrello
    getDishQuantity() {
      const cartStore = useCartStore();
      return (dishId) => cartStore.getDishQuantity(dishId);
    },
  },
  async mounted() {
    this.fetchRestaurantDishes();
  },
  methods: {
    async fetchRestaurantDishes() {
      try {
        const restaurantId = this.$route.params.id;
        const response = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}/dishes`
        );
        this.dishes = response.data.results;

        const restaurantResponse = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}`
        );
        this.restaurant = restaurantResponse.data.results;
        this.loading = false;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.$router.push({ name: "not-found" });
        } else {
          this.error = "Errore durante il caricamento dei dati.";
        }
      }
    },
    addDishToCart(dish) {
      const cartStore = useCartStore();
      cartStore.addDish(dish, this.restaurant);
      // alert("Piatto aggiunto al carrello!");
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
