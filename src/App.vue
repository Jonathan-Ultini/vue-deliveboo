<template>
  <div>
    <AppHeader :cartCount="cart.items.length" @toggle-cart="toggleCart" />
    <CartSidebar v-if="showCart" :cart="cart" @update-cart="updateCart" @close="toggleCart" />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import CartSidebar from './components/CartSidebar.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    CartSidebar,
  },
  data() {
    return {
      showCart: false,
      cart: JSON.parse(localStorage.getItem('cart')) || { restaurantId: null, items: [] },
    };
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
    },
    updateCart(updatedCart) {
      this.cart = updatedCart;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    },
  },
};
</script>
