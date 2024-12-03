<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- colonna tipologie -->
      <div class="col-md-3">
        <h4 class="mb-3">Tipologie</h4>
        <div class="list-group">
          <button v-for="type in types" :key="type.id" class="list-group-item list-group-item-action"
            :class="{ active: selectedTypes.includes(type.id) }">
            {{ type.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'AppMain',
  data() {
    return {
      types: [], //lista di tipologie
      selectedTypes: [], //lista tipologie selezionate
    };
  },
  created() {
    //recupera le tipologie al montagio del componente
    this.fetchTypes();
  },
  methods: {
    //recupera le tipologie dal backend
    async fetchTypes() {
      try {
        const response = await axios.get("/api/types");
        this.types = response.data;
      } catch (error) {
        console.error("Errrore nel caricamento delle tipologie:", error);
      }
    },
  }
};
</script>

<style scoped>
.list-group-item-active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}
</style>
