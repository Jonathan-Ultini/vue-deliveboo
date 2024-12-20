import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import RestaurantDishes from "../components/RestaurantDishes.vue";
import NotFound from "../components/NotFound.vue";
import CheckOut from "../components/CheckOut.vue";
import PaymentSucceeded from "../components/PaymentSucceeded.vue";

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
  {
    path: '/404',
    name: 'not-found',
    component: NotFound,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckOut,
  },
  {
    path: '/paymentsucceeded',
    name: 'payment-succeeded',
    component: PaymentSucceeded
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
