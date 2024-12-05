import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: '/restaurant/:id/dishes',
    name: 'restaurant-dishes',
    component: RestaurantDishes,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
