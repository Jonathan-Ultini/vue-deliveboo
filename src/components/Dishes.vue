<template>
  <div class="container mt-5">
    <h2>Lista Piatti</h2>

    <!-- Mostra un messaggio di caricamento fino a quando i piatti non sono caricati -->
    <div v-if="loading" class="text-center">
      <p>Caricamento...</p>
    </div>

    <!-- Mostra la lista dei piatti -->
    <table class="table mt-3" v-else>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrizione</th>
          <th>Prezzo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dish in dishes" :key="dish.id">
          <td>{{ dish.name }}</td>
          <td>{{ dish.description }}</td>
          <td>{{ dish.price }}€</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dishes: [],  // Array per memorizzare i piatti
      loading: true,  // Flag per il caricamento
    };
  },
  created() {
    // Effettua la richiesta per ottenere i piatti quando il componente viene creato
    this.fetchDishes();
  },
  methods: {
    async fetchDishes() {
      try {
        // Effettua la richiesta GET all'API per ottenere i piatti
        const response = await this.$axios.get('/api/dishes');

        // Assegna i dati ottenuti dalla risposta alla variabile dishes
        this.dishes = response.data.results;
      } catch (error) {
        console.error('Errore nel recuperare i piatti:', error);
      } finally {
        // Imposta loading a false dopo che la risposta è stata ricevuta
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
