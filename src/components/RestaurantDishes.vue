<template>
  <div class="restaurant-dishes">
    <h1>Piatti di {{ restaurant.name }}</h1>

    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">Errore: {{ error }}</div>

    <div v-if="dishes.length > 0">
      <ul>
        <li v-for="dish in dishes" :key="dish.id">
          <h3>{{ dish.name }}</h3>
          <p>{{ dish.description }}</p>
          <p><strong>Prezzo:</strong> {{ dish.price }} €</p>
        </li>
      </ul>
    </div>
    <div v-else-if="!loading && !error">
      Nessun piatto trovato.
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RestaurantDishes",
  data() {
    return {
      restaurant: {},
      dishes: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchRestaurantDishes();
  },
  methods: {
    async fetchRestaurantDishes() {
      try {
        const restaurantId = this.$route.params.id;
        console.log("ID del ristorante:", restaurantId); // Debug per verificare
        const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantId}/dishes`);
        this.dishes = response.data.results;
        console.log("Piatti caricati:", this.dishes);
      } catch (err) {
        this.error = "Impossibile caricare i piatti del ristorante.";
        console.error("Errore API:", err);
      }
    },
  },
};
</script>
