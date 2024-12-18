import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);

// Aggiunge Axios come proprietà globale
app.config.globalProperties.$axios = axios;

app.use(pinia).use(router).mount('#app');
