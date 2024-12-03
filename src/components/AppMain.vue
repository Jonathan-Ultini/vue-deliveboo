<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Colonna delle Tipologie -->
      <div class="col-md-3">
        <h4 class="mb-3">Tipologie</h4>
        <div class="list-group">
          <button v-for="type in types" :key="type.id" class="list-group-item list-group-item-action"
            :class="{ active: selectedTypes.includes(type.id) }" @click="toggleType(type.id)">
            {{ type.name }}
          </button>
        </div>
      </div>

      <!-- Colonna dei Ristoranti -->
      <div class="col-md-9">
        <h4 class="mb-3">Ristoranti</h4>
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else class="row">
          <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-6 col-lg-4 mb-4">
            <router-link :to="`/restaurants/${restaurant.id}/dishes`" class="text-decoration-none">
              <div class="card h-100">
                <img :src="restaurant.image" class="card-img-top" alt="Immagine ristorante" />
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
    };
  },
  created() {
    // Recupera le tipologie al montaggio del componente
    this.fetchTypes();
  },
  methods: {
    // Recupera le tipologie dal backend
    async fetchTypes() {
      try {
        const response = await axios.get("/api/types");
        this.types = response.data;
      } catch (error) {
        console.error("Errore nel caricamento delle tipologie:", error);
      }
    },
    // Recupera i ristoranti in base alle tipologie selezionate
    async fetchRestaurants() {
      this.loading = true;
      try {
        const response = await axios.get("/api/restaurants", {
          params: { types: this.selectedTypes },
        });
        this.restaurants = response.data;
      } catch (error) {
        console.error("Errore nel caricamento dei ristoranti:", error);
      } finally {
        this.loading = false;
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
