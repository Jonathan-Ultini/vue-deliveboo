<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Colonna Tipologie -->
      <div class="col-md-3 col-lg-3 "><!--TODO: impostare per schermo grande -->
        <h4 class="mb-3">Tipologie</h4>
        <!-- Contenuto delle tipologie -->
        <div v-if="loadingTypes" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="types.length === 0" class="text-center">
          <p class="text-muted">Nessuna tipologia disponibile.</p>
        </div>
        <div v-else class="list-group">
          <button v-for="type in types" :key="type.id" class="list-group-item list-group-item-action"
            :class="{ active: selectedTypes.includes(type.id) }" @click="toggleType(type.id)">
            {{ type.name }}
          </button>
        </div>
      </div>

      <!-- Colonna Ristoranti -->
      <div class="col-md-9 col-lg-9">
        <h4 class="mb-3">Ristoranti</h4>
        <!-- Contenuto dei ristoranti -->
        <div v-if="loadingRestaurants" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="restaurants.length === 0" class="text-center">
          <p class="text-muted">Nessun ristorante disponibile.</p>
        </div>
        <div v-else class="row">
          <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-6 col-lg-4 mb-4">
            <router-link :to="`/restaurants/${restaurant.id}/dishes`" class="text-decoration-none">
              <div class="card h-100">
                <img :src="restaurant.image || 'https://via.placeholder.com/300x200?text=No+Image'" class="card-img-top"
                  alt="Immagine ristorante" />
                <div class="card-body">
                  <h5 class="card-title">{{ restaurant.name }}</h5>
                  <p class="card-text">
                    <span v-for="type in restaurant.types" :key="type" class="badge bg-primary me-1">
                      {{ type }}
                    </span>
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "AppMain",
  data() {
    return {
      types: [], // Lista di tipologie
      selectedTypes: [], // Tipologie selezionate
      restaurants: [], // Lista dei ristoranti
      loading: false, // Stato di caricamento
      loadingTypes: false, // Stato di caricamento delle tipologie
      loadingRestaurants: false, // Stato di caricamento dei ristoranti
    };
  },
  created() {
    // Recupera le tipologie al montaggio del componente
    this.fetchTypes();
    this.fetchRestaurants();
  },
  methods: {
    // Carica le tipologie dal backend
    async fetchTypes() {
      this.loadingTypes = true;
      try {
        const response = await axios.get("http://localhost:8000/api/types");
        console.log("Tipologie ricevute:", response.data); // <-- Debug
        this.types = response.data; // Imposta le tipologie dalla risposta
      } catch (error) {
        console.error("Errore nel caricamento delle tipologie:", error);
        this.types = []; // Se c'è un errore, lascia vuoto
      } finally {
        this.loadingTypes = false;
      }
    },

    // Recupera i ristoranti in base alle tipologie selezionate
    async fetchRestaurants() {
      this.loadingRestaurants = true;
      try {
        const response = await axios.get("http://localhost:8000/api/restaurants", {
          params: { types: this.selectedTypes },
        });
        this.restaurants = response.data;
      } catch (error) {
        console.error("Errore nel caricamento dei ristoranti:", error);
      } finally {
        this.loadingRestaurants = false;
      }
    },
    // Aggiunge o rimuove una tipologia selezionata
    toggleType(typeId) {
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
.card img {
  height: 150px;
  object-fit: cover;
}

.card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.list-group-item.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}
</style>
