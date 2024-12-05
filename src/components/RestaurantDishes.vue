<template>
  <div class="restaurant-dishes">
    <h1 class="title">Piatti di {{ restaurant.name }}</h1>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">Errore: {{ error }}</div>

    <div v-if="dishes.length > 0" class="dishes-container">
      <div v-for="dish in dishes" :key="dish.id" class="card">
        <img v-if="dish.image_url" :src="`http://localhost:8000` + dish.image_url" alt="Immagine del piatto"
          class="dish-image" />
        <!-- <p>{{ dish.image_url }}</p> -->

        <h3 class="card-title">{{ dish.name }}</h3>
        <p class="card-description">{{ dish.description }}</p>
        <p class="card-price"><strong>Prezzo:</strong> {{ dish.price }} €</p>
      </div>
    </div>
    <div v-else-if="!loading && !error" class="no-dishes">
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
      dishes: [],
      restaurant: {},
      loading: true,
      error: null,
    };
  },
  async mounted() {
    this.fetchRestaurantDishes();
  },
  methods: {
    async fetchRestaurantDishes() {
      try {
        const restaurantId = this.$route.params.id;
        console.log("ID del ristorante:", restaurantId);
        const response = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}/dishes`
        );
        this.dishes = response.data.results;
        const restaurantResponse = await axios.get(
          `http://localhost:8000/api/restaurants/${restaurantId}`
        );

        this.restaurant = restaurantResponse.data.results;
        //console.log("Nome del ristorante:", this.restaurant);
        this.loading = false;
      } catch (err) {
        this.error = "Impossibile caricare i dati.";
        this.loading = false;
        console.error("Errore API:", err);
      }
    },
  },
};
</script>

<style scoped>
.restaurant-dishes {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.loading,
.error,
.no-dishes {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.dishes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.dish-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  display: block;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.card-description {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #666;
}

.card-price {
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
}
</style>
