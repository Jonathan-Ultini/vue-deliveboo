<template>
  <div class="restaurant-dishes container">
    <h1 class="title text-center my-4">Piatti di {{ restaurant.name }}</h1>

    <!-- Caricamento o errore -->
    <div v-if="loading" class="loading text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>
    <div v-else-if="error" class="error text-danger text-center">
      {{ error }}
    </div>

    <!-- Lista dei Piatti -->
    <div v-if="dishes.length > 0">
      <div v-for="dish in dishes" :key="dish.id" class="card mb-3">
        <div class="row g-0 align-items-center">
          <div class="col-md-4">
            <img v-if="dish.image_url" :src="dish.image_url" alt="Immagine del piatto"
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
                <button class="btn btn-primary btn-sm" @click="addToCart(dish)">
                  <i class="bi bi-plus"></i> Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nessun Piatto -->
    <div v-else-if="!loading && !error" class="no-dishes text-center">
      <p class="text-danger fs-4 fw-bold">Nessun piatto trovato.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useCartStore } from "@/store/cartStore"; // Path corretto al nuovo store
import { ref, computed } from "vue";

export default {
  name: "RestaurantDishes",
  setup() {
    const cartStore = useCartStore();

    const restaurant = ref({});
    const dishes = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const baseUrl = "http://localhost:8000";

    const fetchRestaurantDishes = async (slug) => {
      try {
        loading.value = true;

        // Ottieni i dettagli del ristorante
        const restaurantResponse = await axios.get(`${baseUrl}/api/restaurants/${slug}`);
        restaurant.value = restaurantResponse.data.results;

        // Ottieni i piatti del ristorante
        const dishesResponse = await axios.get(`${baseUrl}/api/restaurants/${slug}/dishes`);
        dishes.value = dishesResponse.data.results;

        loading.value = false;
      } catch (err) {
        loading.value = false;
        if (err.response?.status === 404) {
          error.value = "Ristorante non trovato.";
        } else {
          error.value = "Errore durante il caricamento dei dati.";
        }
      }
    };

    const addToCart = (dish) => {
      cartStore.addToCart(dish, restaurant.value.id);
      alert("Piatto aggiunto al carrello!");
    };



    return {
      restaurant,
      dishes,
      loading,
      error,
      baseUrl,
      fetchRestaurantDishes,
      addToCart,
    };
  },
  async mounted() {
    const slug = this.$route.params.slug;
    await this.fetchRestaurantDishes(slug);
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.params.slug !== from.params.slug) {
      await this.fetchRestaurantDishes(to.params.slug);
    }
    next();
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
