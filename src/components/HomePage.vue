<template>
  <div class="homepage">
    <div class="container">
      <!-- Titolo principale della pagina -->
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="my-4">Ristoranti per Tipologia</h1>
        </div>
      </div>

      <!-- Lista delle tipologie con selezione -->
      <div class="row">
        <div class="col-12">
          <ul class="type-list d-flex flex-wrap justify-content-center">
            <li v-for="type in types" :key="type.id" @click="toggleTypeSelection(type.id)"
              :class="['btn', 'me-2', 'mb-2', selectedTypes.includes(type.id) ? 'btn-primary' : 'btn-outline-secondary']">
              {{ type.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Stato di caricamento o errore -->
      <div class="row">
        <div v-if="loading" class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
        </div>
        <div v-else-if="error" class="col-12 text-center text-danger">
          {{ error }}
        </div>
      </div>

      <!-- Griglia dei ristoranti -->
      <div v-if="restaurants.length > 0" class="row mt-4">
        <div class="col-12">
          <h2 class="text-center mb-4">Ristoranti</h2>
        </div>
        <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <router-link :to="{ name: 'restaurant-dishes', params: { slug: restaurant.slug } }"
            class="restaurant-card text-decoration-none">
            <div class="card">
              <!-- Immagine o segnaposto del ristorante -->
              <div class="card-cover">
                <img v-if="restaurant.dishes && restaurant.dishes[0]"
                  :src="`http://localhost:8000/storage/` + restaurant.dishes[0].img" alt="Immagine del ristorante"
                  class="card-img-top" />
                <div v-else class="placeholder-image text-center">
                  Nessuna immagine
                </div>
              </div>
              <!-- Informazioni del ristorante -->
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text">{{ restaurant.address }}</p>
                <p class="card-text">
                  <strong>Tipi:</strong>
                  <span v-for="type in restaurant.types" :key="type.id">
                    {{ type.name }}{{ type.id === restaurant.types[restaurant.types.length - 1].id ? '' : ', ' }}
                  </span>
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Messaggio in caso di nessun risultato -->
      <div v-else-if="!loading && !error" class="row">
        <div class="col-12 text-center">
          <p class="text-danger fs-4 fw-bold">Nessun ristorante trovato con le tipologie richieste.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      types: [], // Tipologie di ristoranti
      restaurants: [], // Elenco dei ristoranti
      selectedTypes: [], // Tipologie selezionate dall'utente
      loading: false, // Stato di caricamento
      error: null, // Messaggio di errore
    };
  },
  computed: {
    visibleRestaurants() {
      // Mostra i primi 5 ristoranti
      return this.restaurants.slice(0, 5);
    },
  },
  mounted() {
    // Carica le tipologie e i ristoranti all'avvio del componente
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        // Richiesta API per le tipologie
        const typesResponse = await axios.get("http://localhost:8000/api/types");
        this.types = typesResponse.data.results;

        // Richiesta API per i ristoranti
        const restaurantsResponse = await axios.get("http://localhost:8000/api/restaurants");
        this.restaurants = restaurantsResponse.data.results.data;
      } catch (err) {
        this.error = "Errore nel caricamento dei dati. Riprova più tardi.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    toggleTypeSelection(typeId) {
      // Aggiunge o rimuove una tipologia selezionata
      const index = this.selectedTypes.indexOf(typeId);
      if (index === -1) {
        this.selectedTypes.push(typeId);
      } else {
        this.selectedTypes.splice(index, 1);
      }
      this.fetchFilteredRestaurants();
    },
    async fetchFilteredRestaurants() {
      this.loading = true;
      try {
        // Costruisce la query per il filtro
        const queryString = this.selectedTypes.join(",");
        const response = await axios.get(
          queryString.length > 0
            ? `http://localhost:8000/api/restaurants?types=${queryString}`
            : "http://localhost:8000/api/restaurants"
        );

        this.restaurants = response.data.results.data;
      } catch (err) {
        this.error = "Errore nel caricamento dei ristoranti filtrati.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
.homepage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.type-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.type-list li {
  cursor: pointer;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}

.type-list li:hover {
  background-color: #e2e6ea;
}

.type-list li.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.slider-container {
  overflow: hidden;
}

.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.slider-track {
  gap: 1rem;
  max-width: 100%;
  padding: 10px 0;
}

.restaurant-card {
  flex: 0 0 auto;
  max-width: 250px;
}

.restaurant-card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.restaurant-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.arrow {
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.arrow.left {
  position: absolute;
  left: -30px;
}

.arrow.right {
  position: absolute;
  right: -30px;
}

/* Rimuove colore blu e sottolineatura dai link */
.text-dark {
  color: #212529 !important;
}

.text-decoration-none {
  text-decoration: none !important;
}

/* Contenitore immagine di copertina */
.card-cover {
  height: 150px;
  overflow: hidden;
}

.card-cover img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

/* Contenuto della card */
.card-content {
  padding: 10px;
  text-align: left;
}

.card-content h3 {
  font-size: 1.2rem;
  margin: 0 0 5px;
  color: #333;
}

.card-content p {
  margin: 0;
  color: #555;
}

/* Contenuto della card */
.card-body {
  padding: 10px;
  text-align: left;
  flex-grow: 1;
}

/* Stile per il testo che non fa allargare la card */
.card-body .card-title,
.card-body .card-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}

.placeholder-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 14px;
  color: #999;
}
</style>
