<template>
  <div class="container mt-5">
    <h2>Benvenuto nella tua Dashboard</h2>
    <div v-if="store.isAuthenticated">
      <p>Nome ristorante: {{ store.user.name }}</p>
      <p>Email: {{ store.user.email }}</p>
      <button class="btn btn-danger" @click="store.logout">Logout</button>
    </div>
    <div v-else>
      <p>Non sei autenticato. Effettua il login per accedere.</p>
    </div>
  </div>
</template>

<script>
import store from '../store';

export default {
  computed: {
    store() {
      return store;
    },
  },
};
</script>
