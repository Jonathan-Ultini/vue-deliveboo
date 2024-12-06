<template>
  <div class="homepage">
    <h1>Ristoranti per Tipologia</h1>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">Errore: {{ error }}</div>

    <ul class="type-list">
      <li v-for="type in types" :key="type.id" @click="toggleTypeSelection(type.id)"
        :class="{ active: selectedTypes.includes(type.id) }">
        {{ type.name }}
      </li>
    </ul>

    <div v-if="restaurants.length > 0" class="slider-container">
      <h2>Ristoranti</h2>
      <div class="slider">
        <button class="arrow left" @click="prevSlide">&#8592;</button>
        <div class="slider-track">
          <router-link v-for="restaurant in visibleRestaurants" :key="restaurant.id"
            :to="{ name: 'restaurant-dishes', params: { id: restaurant.id } }">
            <div class="restaurant-card">
              <h3>{{ restaurant.name }}</h3>
              <p>{{ restaurant.address }}</p>
              <p><strong>Tipi:</strong>
                <span v-for="type in restaurant.types" :key="type.id">
                  {{ type.name }}{{ type.id === restaurant.types[restaurant.types.length - 1].id ? '' : ', ' }}
                </span>
              </p>
            </div>
          </router-link>
        </div>
        <button class="arrow right" @click="nextSlide">&#8594;</button>
      </div>
    </div>

    <div v-else-if="!loading && !error" class="no-results">
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
      types: [], // array che conterrá tutte le tipologie di ristoranti
      restaurants: [], // array che conterrá i ristoranti
      selectedTypes: [], // array degli ID delle tipologie selezionaate
      loading: true, // stato caricamento dei dati
      error: null, // messaggio di errore in caso di problemi con le api
      currentIndex: 0, // Indice dello slider per tracciare il primo elemento
      visibleCount: 5, // numero massimo di ristoranti visibili nello slider
    };
  },
  computed: {
    // calcola i ristoranti visibili in base all'indice corrente dello slider
    visibleRestaurants() {
      const start = this.currentIndex; // indice iniziale
      const end = start + this.visibleCount; //indice finale
      return this.restaurants.slice(start, end); //ritorna una porzione dell'array
    },
  },
  mounted() {
    // quando il componente viene montato, carica i tipi e i ristoranti
    this.fetchTypes(); // carica i tipi di ristoranti dall'api
    this.fetchRestaurants(); // carica ristoranti dall'api
  },
  methods: {
    // metodo per ottenere le tipologie di ristoranti dei tipi
    async fetchTypes() {
      try {
        // effettua una richiesta GET all'endpoint dei tipi
        const response = await axios.get("http://localhost:8000/api/types");
        this.types = response.data.results; // salva i tipi di ristoranti nell'array
      } catch (err) {
        // in caso di errore, salva un messaggio di errore
        this.error = "Impossibile caricare i tipi di ristoranti.";
      } finally {
        // fine del caricamento, indipendentemente dal risultato
        this.loading = false;
      }
    },


    // metodo per ottenere i ristoranti filtrati in base ai tipi selezionati
    async fetchRestaurants() {
      this.loading = true; // imposta lo stato di caricamento a true
      try {
        // costruisce una stringa con gli id delle tipologie selezionate
        const queryString = this.selectedTypes.join(",");
        const url =
          queryString.length > 0
            ? `http://localhost:8000/api/restaurants?types=${queryString}` // URL con filtro
            : "http://localhost:8000/api/restaurants"; // URL senza filtro
        const response = await axios.get(url); // effettua la richiesta GET
        this.restaurants = response.data.results.data; // salva i ristoranti nell'array
        this.currentIndex = 0; // Resetta lo slider all'inizio
      } catch (err) {
        // In caso di errore, salva un messaggio e resetta l'elenco dei ristoranti
        this.error = "Impossibile caricare i ristoranti.";
        this.restaurants = [];
      } finally {
        // Fine del caricamento, indipendentemente dal risultato
        this.loading = false;
      }
    },


    // Metodo per gestire la selezione/deselezione di una tipologia
    toggleTypeSelection(typeId) {
      const index = this.selectedTypes.indexOf(typeId); // Cerca l'indice del tipo selezionato
      if (index === -1) {
        // Se il tipo non è presente, lo aggiunge
        this.selectedTypes.push(typeId);
      } else {
        // Se il tipo è già presente, lo rimuove
        this.selectedTypes.splice(index, 1);
      }
      this.fetchRestaurants(); // Aggiorna l'elenco dei ristoranti in base ai tipi selezionati
    },


    // Metodo per passare al prossimo gruppo di ristoranti nello slider
    nextSlide() {
      // Controlla se ci sono ancora elementi visibili dopo il gruppo corrente
      if (this.currentIndex + this.visibleCount < this.restaurants.length) {
        this.currentIndex += 1; // Incrementa l'indice corrente
      }
    },


    // Metodo per tornare al gruppo precedente di ristoranti nello slider
    prevSlide() {
      // Controlla se l'indice corrente è maggiore di 0
      if (this.currentIndex > 0) {
        this.currentIndex -= 1; // Decrementa l'indice corrente
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
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
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

.slider-container {
  position: relative;
}

.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.slider-track {
  display: flex;
  gap: 10px;
  overflow: hidden;
  max-width: 100%;
  padding: 10px 0;
}

.restaurant-card {
  flex: 0 0 calc(20% - 10px);
  /* 5 card visibili */
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f8f9fa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.restaurant-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.arrow {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.arrow.left {
  left: -20px;
}

.arrow.right {
  right: -20px;
}
</style>
