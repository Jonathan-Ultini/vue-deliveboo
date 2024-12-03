import { createRouter, createWebHistory } from "vue-router";
import AppMain from "../components/AppMain.vue";

const routes = [
  { path: "/", component: AppMain },
  { path: "/restaurants/:id/dishes", component: RestaurantDishes, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
