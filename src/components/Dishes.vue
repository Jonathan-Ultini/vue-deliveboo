<template>
  <div class="container mt-5">
    <h2>Lista Piatti</h2>

    <!-- Sezione Form (Aggiungi o Modifica Piatto) -->
    <div class="card p-4 mb-4" v-if="showForm">
      <h3>{{ editing ? 'Modifica Piatto' : 'Aggiungi Piatto' }}</h3>
      <form @submit.prevent="saveDish">
        <div class="mb-3">
          <label for="name" class="form-label">Nome</label>
          <input type="text" id="name" v-model="form.name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descrizione</label>
          <textarea id="description" v-model="form.description" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Prezzo (€)</label>
          <input type="number" step="0.01" id="price" v-model="form.price" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">
          {{ editing ? 'Salva Modifiche' : 'Aggiungi Piatto' }}
        </button>
        <button v-if="editing" @click="resetForm" type="button" class="btn btn-secondary ms-2">Annulla</button>
      </form>
    </div>

    <!-- Pulsante per mostrare/nascondere il form -->
    <div class="text-end mb-3">
      <button @click="toggleForm" class="btn btn-success">
        {{ showForm ? 'Chiudi Form' : 'Aggiungi Piatto' }}
      </button>
    </div>

    <!-- Messaggio di caricamento -->
    <div v-if="loading" class="text-center">
      <p>Caricamento...</p>
    </div>

    <!-- Tabella dei piatti -->
    <table class="table mt-3" v-else>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrizione</th>
          <th>Prezzo</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dish in dishes" :key="dish.id">
          <td>{{ dish.name }}</td>
          <td>{{ dish.description }}</td>
          <td>{{ dish.price }}€</td>
          <td>
            <button @click="editDish(dish)" class="btn btn-warning btn-sm">Modifica</button>
            <button @click="deleteDish(dish.id)" class="btn btn-danger btn-sm">Elimina</button>
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
      loading: true,
      form: {
        id: null,
        name: '',
        description: '',
        price: '',
      },
      editing: false, // Indica se si sta modificando un piatto
      showForm: false, // Controlla la visibilità del form
    };
  },
  created() {
    this.fetchDishes();
  },
  methods: {
    // Recupera la lista dei piatti
    async fetchDishes() {
      try {
        const response = await this.$axios.get('/api/dishes');
        this.dishes = response.data.results;
      } catch (error) {
        console.error('Errore nel recuperare i piatti:', error);
      } finally {
        this.loading = false;
      }
    },

    // Salva un nuovo piatto o aggiorna un piatto esistente
    async saveDish() {
      try {
        if (this.editing) {
          await this.$axios.put(`/api/dishes/${this.form.id}`, this.form);
        } else {
          const response = await this.$axios.post('/api/dishes', this.form);
          this.dishes.push(response.data);
        }
        this.resetForm();
        this.fetchDishes();
        this.showForm = false; // Nascondi il form dopo il salvataggio
      } catch (error) {
        console.error('Errore durante il salvataggio del piatto:', error);
      }
    },

    // Popola il form per modificare un piatto
    editDish(dish) {
      this.form = { ...dish };
      this.editing = true;
      this.showForm = true; // Mostra il form per la modifica
    },

    // Elimina un piatto
    async deleteDish(id) {
      try {
        await this.$axios.delete(`/api/dishes/${id}`);
        this.dishes = this.dishes.filter(dish => dish.id !== id);
      } catch (error) {
        console.error('Errore durante l\'eliminazione del piatto:', error);
      }
    },

    // Resetta il form
    resetForm() {
      this.form = { id: null, name: '', description: '', price: '' };
      this.editing = false;
      this.showForm = false; // Nascondi il form se viene annullato
    },

    // Mostra o nascondi il form
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) this.resetForm(); // Resetta il form quando viene chiuso
    },
  },
};

</script>
