<template>
  <div class="homepage">
    <h1>Ristoranti per Tipologia</h1>
    <!-- Selezione dei tipi -->
    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">Errore: {{ error }}</div>
    <ul>
      <li v-for="type in types" :key="type.id" @click="fetchRestaurants(type.id)"
        :class="{ active: selectedType === type.id }">
        {{ type.name }}
      </li>
    </ul>

    <!-- Lista ristoranti -->
    <div v-if="restaurants.length > 0">
      <h2>Ristoranti</h2>
      <ul>
        <li v-for="restaurant in restaurants" :key="restaurant.id">
          {{ restaurant.name }}
        </li>
      </ul>
    </div>
    <div v-else-if="!loading && !error">Nessun ristorante trovato.</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      types: [],
      restaurants: [],
      selectedType: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchTypes();
  },
  methods: {
    // Chiamata API per i tipi
    async fetchTypes() {
      try {
        const response = await axios.get("http://localhost:8000/api/types");
        this.types = response.data.results; // Adatta in base alla struttura dell'API
        this.loading = false;
      } catch (err) {
        this.error = "Impossibile caricare i tipi di ristoranti.";
        this.loading = false;
      }
    },
    // Chiamata API per i ristoranti filtrati
    async fetchRestaurants(typeId) {
      try {
        this.selectedType = typeId;
        const response = await axios.get(
          `http://localhost:8000/api/restaurants?type=${typeId}`
        );
        this.restaurants = response.data.results; // Adatta alla struttura dell'API
      } catch (err) {
        this.error = "Impossibile caricare i ristoranti.";
        this.restaurants = [];
      }
    },
  },
};
</script>

<style scoped>
.homepage ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

.homepage ul li {
  cursor: pointer;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}

.homepage ul li:hover {
  background-color: #e2e6ea;
}

.homepage ul li.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>
