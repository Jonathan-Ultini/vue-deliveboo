<template>
  <div class="homepage">
    <h1>Ristoranti per Tipologia</h1>
    <!-- Selezione dei tipi -->
    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">Errore: {{ error }}</div>
    <ul>
      <li v-for="type in types" :key="type.id" @click="toggleTypeSelection(type.id)"
        :class="{ active: selectedTypes.includes(type.id) }">
        {{ type.name }}
      </li>
    </ul>

    <!-- Pulsante per cercare -->
    <button @click="fetchRestaurants" :disabled="selectedTypes.length === 0">
      Cerca Ristoranti
    </button>

    <!-- Lista ristoranti -->
    <div v-if="restaurants.length > 0">
      <h2>Ristoranti</h2>
      <ul>
        <li v-for="restaurant in restaurants" :key="restaurant.id">
          {{ restaurant.name }}
        </li>
      </ul>
    </div>
    <div v-else-if="!loading && !error && selectedTypes.length > 0">
      Nessun ristorante trovato per i tipi selezionati.
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
      selectedTypes: [], // Lista degli ID selezionati
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
    // Aggiunge o rimuove un tipo selezionato
    toggleTypeSelection(typeId) {
      const index = this.selectedTypes.indexOf(typeId);
      if (index === -1) {
        this.selectedTypes.push(typeId); // Aggiunge il tipo
      } else {
        this.selectedTypes.splice(index, 1); // Rimuove il tipo
      }
    },
    // Chiamata API per i ristoranti filtrati
    async fetchRestaurants() {
      try {
        const queryString = this.selectedTypes.join(",");
        const response = await axios.get(
          `http://localhost:8000/api/restaurants?types=${queryString}`
        );
        this.restaurants = response.data.results.data; // Adatta se necessario
        console.log("Ristoranti caricati:", this.restaurants); // Logga i ristoranti
      } catch (err) {
        this.error = "Impossibile caricare i ristoranti.";
        this.restaurants = [];
        console.error("Errore API:", err); // Logga l'errore
      }
    }
    ,
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

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
