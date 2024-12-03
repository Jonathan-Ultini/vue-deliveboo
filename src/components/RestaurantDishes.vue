<template>
  <div class="container py-4">
    <h2 class="mb-4">Piatti del ristorante</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="row">
      <div v-for="dish in dishes" :key="dish.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <img :src="dish.image" class="card-img-top" alt="Immagine piatto" />
          <div class="card-body">
            <h5 class="card-title">{{ dish.name }}</h5>
            <p class="card-text">{{ dish.description }}</p>
            <p class="card-text">
              <strong>Prezzo: €{{ dish.price.toFixed(2) }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RestaurantDishes",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dishes: [], // Lista dei piatti
      loading: false, // Stato di caricamento
    };
  },
  created() {
    // Recupera i piatti al montaggio del componente
    this.fetchDishes();
  },
  methods: {
    async fetchDishes() {
      this.loading = true;
      try {
        const response = await axios.get(`/api/restaurants/${this.id}/dishes`);
        this.dishes = response.data;
      } catch (error) {
        console.error("Errore nel caricamento dei piatti:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card img {
  height: 150px;
  object-fit: cover;
}

.card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
