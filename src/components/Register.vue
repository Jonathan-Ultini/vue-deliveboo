<template>
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Nome Ristorante</label>
        <input type="text" class="form-control" id="name" v-model="name" required />
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Indirizzo</label>
        <input type="text" class="form-control" id="address" v-model="address" required />
      </div>
      <div class="mb-3">
        <label for="piva" class="form-label">P.IVA</label>
        <input type="text" class="form-control" id="piva" v-model="piva" required />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      name: '',
      address: '',
      piva: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await this.$axios.post('/register', {
          email: this.email,
          password: this.password,
          name: this.name,
          address: this.address,
          piva: this.piva,
        });
        alert('Registrazione completata con successo!');
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Errore durante la registrazione.');
      }
    },
  },
};
</script>
