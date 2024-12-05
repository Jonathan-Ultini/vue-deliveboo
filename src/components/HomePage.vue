<template>
  <div class="homepage">
    <h1>Ristoranti per Tipologia</h1>
    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">Errore: {{ error }}</div>
    <ul>
      <li v-for="type in types" :key="type.id">
        {{ type.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      types: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchTypes();
  },
  methods: {
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
  },
};
</script>

<style scoped>
.homepage {
  padding: 20px;
}
</style>
