<template>
  <div class="container mt-5">
    <h2>Gestisci Piatti</h2>
    <!-- <div>
      <button class="btn btn-success" @click="addDish">Aggiungi Piatto</button>
    </div> -->

    <table class="table mt-3">
      <thead>
        <tr>
          <th>Nome Piatto</th>
          <th>Prezzo</th>
          <th>Visibile</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dish in dishes" :key="dish.id">
          <td>{{ dish.name }}</td>
          <td>{{ dish.price }}</td>
          <td>{{ dish.is_visible ? 'Sì' : 'No' }}</td>
          <td>
            <button class="btn btn-primary" @click="editDish(dish.id)">Modifica</button>
            <button class="btn btn-danger" @click="deleteDish(dish.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dishes: [],
    };
  },
  created() {
    this.fetchDishes();
  },
  methods: {
    async fetchDishes() {
      try {
        const response = await this.$axios.get('dishes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.dishes = response.data;
      } catch (error) {
        console.error('Errore nel recuperare i piatti:', error);
      }
    },
    // addDish() {
    //   this.$router.push('/add-dish'); // Reindirizza alla pagina per aggiungere un piatto
    // },
    // editDish(dishId) {
    //   this.$router.push(`/edit-dish/${dishId}`); // Reindirizza alla pagina di modifica del piatto
    // },
    // async deleteDish(dishId) {
    //   try {
    //     await this.$axios.delete(`/dishes/${dishId}`, {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       },
    //     });
    //     this.fetchDishes(); // Ricarica i piatti dopo l'eliminazione
    //   } catch (error) {
    //     console.error('Errore nell\'eliminare il piatto:', error);
    //   }
    // },
  },
};
</script>

<style scoped></style>
