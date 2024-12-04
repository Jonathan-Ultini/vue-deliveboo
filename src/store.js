import { reactive } from 'vue';
import axios from 'axios';
import router from './router';

const store = reactive({
  user: null,
  token: null,
  isAuthenticated: false,

  async login(email, password) {
    try {
      const response = await axios.post('/api/login', { email, password });
      this.token = response.data.token;
      this.isAuthenticated = true;
      await this.fetchUser(); // Recupera i dati dell'utente
      router.push('/dashboard'); // Reindirizza alla dashboard
    } catch (error) {
      console.error('Errore durante il login:', error);
      alert('Credenziali non valide.');
    }
  },

  async register(userData) {
    try {
      await axios.post('/api/register', userData);
      alert('Registrazione completata con successo! Ora effettua il login.');
      router.push('/login');
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      alert('Errore durante la registrazione.');
    }
  },

  async fetchUser() {
    try {
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.user = response.data;
    } catch (error) {
      console.error('Errore nel recuperare i dati utente:', error);
      this.logout();
    }
  },

  logout() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    router.push('/login');
  },
});

export default store;
