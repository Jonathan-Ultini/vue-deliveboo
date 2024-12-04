import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);

// Aggiunge Axios come proprietà globale
app.config.globalProperties.$axios = axios;

app.use(router).mount('#app');
