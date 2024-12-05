<template>
  <div class="homepage">
    <h1>Ristoranti per Tipologia</h1>

    <!-- Selezione dei tipi -->
    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">Errore: {{ error }}</div>
    <ul class="type-list">
      <li v-for="type in types" :key="type.id" @click="toggleTypeSelection(type.id)"
        :class="{ active: selectedTypes.includes(type.id) }">
        {{ type.name }}
      </li>
    </ul>

    <!-- Slider ristoranti -->
    <div v-if="restaurants.length > 0">
      <h2>Ristoranti</h2>
      <div class="restaurant-slider">
        <div class="restaurant-card" v-for="restaurant in restaurants" :key="restaurant.id">
          <h3>{{ restaurant.name }}</h3>
          <p>{{ restaurant.address }}</p>
          <p><strong>Tipi:</strong>
            <span v-for="type in restaurant.types" :key="type.id">
              {{ type.name }}{{ type.id === restaurant.types[restaurant.types.length - 1].id ? '' : ', ' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !error">
      Nessun ristorante trovato.
    </div>
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
      selectedTypes: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchTypes();
    this.fetchRestaurants(); // Carica tutti i ristoranti all'inizio
  },
  methods: {
    // Chiamata API per i tipi
    async fetchTypes() {
      try {
        const response = await axios.get("http://localhost:8000/api/types");
        this.types = response.data.results;
        this.loading = false;
      } catch (err) {
        this.error = "Impossibile caricare i tipi di ristoranti.";
        this.loading = false;
      }
    },
    // Chiamata API per i ristoranti filtrati
    async fetchRestaurants() {
      this.loading = true;
      try {
        const queryString = this.selectedTypes.join(",");
        const url =
          queryString.length > 0
            ? `http://localhost:8000/api/restaurants?types=${queryString}`
            : "http://localhost:8000/api/restaurants";
        const response = await axios.get(url);
        this.restaurants = response.data.results.data;
        console.log("Ristoranti caricati:", this.restaurants);
      } catch (err) {
        this.error = "Impossibile caricare i ristoranti.";
        this.restaurants = [];
        console.error("Errore API:", err);
      } finally {
        this.loading = false;
      }
    },
    // Aggiunge o rimuove un tipo selezionato e aggiorna i risultati
    toggleTypeSelection(typeId) {
      const index = this.selectedTypes.indexOf(typeId);
      if (index === -1) {
        this.selectedTypes.push(typeId);
      } else {
        this.selectedTypes.splice(index, 1);
      }
      this.fetchRestaurants();
    },
  },
};
</script>


<style scoped>
.type-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

.type-list li {
  cursor: pointer;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}

.type-list li:hover {
  background-color: #e2e6ea;
}

.type-list li.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.restaurant-slider {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
}

.restaurant-card {
  min-width: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f8f9fa;
}

.restaurant-card h3 {
  margin: 0 0 10px 0;
}

.restaurant-card p {
  margin: 0;
}
</style>
