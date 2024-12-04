<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$axios.post('/login', {
          email: this.email,
          password: this.password,
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Credenziali non valide.');
      }
    },
  },
};
</script>
