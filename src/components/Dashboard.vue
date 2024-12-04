<template>
  <div class="container mt-5">
    <h2>Benvenuto nella tua Dashboard</h2>

    <!-- Se l'utente è autenticato, visualizziamo i dati -->
    <div v-if="isAuthenticated">
      <p>Nome ristorante: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>

      <!--la gestione dei piatti -->
      <!-- <div>
        <h3>I tuoi piatti</h3>
        <button class="btn btn-primary" @click="goToDishesPage">Gestisci Piatti</button>
      </div>-->
    </div>

    <!-- Se l'utente non è autenticato -->
    <div v-else>
      <p>Per accedere alla tua dashboard, effettua il login.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      isAuthenticated: false,
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    // Controlla se l'utente è autenticato
    checkAuthentication() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;
        this.fetchUserData();
      }
    },

    // Recupera i dati dell'utente autenticato
    async fetchUserData() {
      try {
        const response = await this.$axios.get('/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error('Errore nel recuperare i dati dell\'utente:', error);
      }
    },

    // Reindirizza alla pagina di gestione piatti
    // goToDishesPage() {
    //   this.$router.push('/dishes');
    // }
  }
};
</script>

<style scoped></style>
