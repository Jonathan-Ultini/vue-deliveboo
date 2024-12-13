<template>
  <div>
    <AppHeader :cartCount="cartCount" @toggle-cart="toggleCart" />

    <CartSidebar v-if="showCart" :cart="cartItems" @update-quantity="handleUpdateQuantity"
      @remove-item="handleRemoveItem" @close="toggleCart" />

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import CartSidebar from "./components/CartSidebar.vue";
import { useCartStore } from "@/store/cartStore";
import { computed, onMounted, onBeforeUnmount } from "vue";

export default {
  components: {
    AppHeader,
    AppFooter,
    CartSidebar,
  },
  setup() {
    const cartStore = useCartStore();

    const cartCount = computed(() => cartStore.itemCount);
    const cartItems = computed(() => cartStore.sortedItems); // Usa il getter ordinato
    const showCart = computed(() => cartStore.showCart);

    const toggleCart = () => {
      cartStore.toggleCartSidebar();
    };

    const handleUpdateQuantity = (dishId, changeAmount) => {
      cartStore.updateQuantity(dishId, changeAmount);
    };

    const handleRemoveItem = (dishId) => {
      cartStore.removeFromCart(dishId);
    };

    onMounted(() => {
      cartStore.loadCart();
      cartStore.setupBeforeUnload();
    });

    onBeforeUnmount(() => {
      cartStore.teardownBeforeUnload();
    });

    return {
      cartCount,
      cartItems,
      toggleCart,
      showCart,
      handleUpdateQuantity,
      handleRemoveItem,
    };
  },
};
</script>
