<template>
  <div>
    <!-- Usa il CartStore per aggiornare automaticamente il conteggio -->
    <AppHeader @toggle-cart="toggleCart" />
    <!-- Passa il cartStore direttamente a CartSidebar -->
    <CartSidebar v-if="showCart" @close="toggleCart" />
    <AppFooter />
  </div>
</template>

<script>
import { useCartStore } from './stores/cartStore';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import CartSidebar from './components/CartSidebar.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    CartSidebar,
  },
  setup() {
    const cartStore = useCartStore(); // Inizializza il CartStore
    return {
      cartStore, // Rende il cartStore disponibile nel template
    };
  },
  data() {
    return {
      showCart: false, // Stato locale per mostrare/nascondere il carrello
    };
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
    },
  },
};
</script>
