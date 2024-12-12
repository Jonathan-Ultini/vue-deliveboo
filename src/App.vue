<template>
  <div>
    <AppHeader :cartCount="cartCount" @toggle-cart="toggleCart" />

    <CartSidebar v-if="showCart" :cart="cartStore.cart" @update-cart="updateCart" @close="toggleCart" />

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import CartSidebar from './components/CartSidebar.vue';
import { useCartStore } from '@/store/cartStore';
import { computed } from 'vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    CartSidebar,
  },
  setup() {
    const cartStore = useCartStore();

    const cartCount = computed(() => cartStore.itemCount);

    const showCart = computed(() => cartStore.showCart);

    const toggleCart = () => {
      cartStore.showCart = !cartStore.showCart;
    };

    const updateCart = (updatedCart) => {
      cartStore.cart = updatedCart;
      cartStore.saveCart();
    };

    return {
      cartStore,
      cartCount,
      toggleCart,
      showCart,
      updateCart,
    };
  },
};
</script>
