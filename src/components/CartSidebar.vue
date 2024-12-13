<template>
  <div class="cart-sidebar">
    <div class="cart-header">
      <h3>Carrello</h3>
      <button class="close-btn" @click="$emit('close')">X</button>
    </div>
    <div v-if="cartItems.length > 0" class="cart-body">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="Piatto" class="item-image" />
        <div class="item-details">
          <h4>{{ item.name }}</h4>
          <p class="price">Prezzo: {{ item.price }} €</p>
          <div class="quantity-control">
            <button class="btn quantity-btn" :disabled="item.quantity <= 1" @click="updateQuantity(item.id, -1)">
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button class="btn quantity-btn" @click="updateQuantity(item.id, 1)">
              +
            </button>
          </div>
        </div>
        <button class="remove-btn" @click="removeItem(item.id)">Rimuovi</button>
      </div>
      <div class="cart-footer">
        <p class="total">Totale: <strong>{{ total }} €</strong></p>
        <button class="checkout-btn" @click="checkout">Vai al Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Il carrello è vuoto!</p>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/store/cartStore";
import { computed } from "vue";

export default {
  name: "CartSidebar",
  setup(_, { emit }) {
    const cartStore = useCartStore();

    const cartItems = computed(() => cartStore.cart.items);
    const total = computed(() => cartStore.total);

    const updateQuantity = (dishId, delta) => {
      cartStore.updateQuantity(dishId, delta);
    };

    const removeItem = (dishId) => {
      cartStore.removeFromCart(dishId);
    };

    const checkout = () => {
      // Logica per il checkout
      console.log("navigazione al checkout con i seguenti articoli:", cartStore.cart.items);
    };

    return {
      cartItems,
      total,
      updateQuantity,
      removeItem,
      checkout,
    };
  },
};
</script>

<style>
.cart-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
  font-family: Arial, sans-serif;
  transition: transform 0.3s ease-in-out;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cart-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.close-btn {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}

.item-details {
  flex-grow: 1;
}

.item-details h4 {
  font-size: 1.1rem;
  margin: 0;
}

.price {
  font-size: 1rem;
  color: #777;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-control .btn {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.quantity-control .btn:hover {
  background-color: #ddd;
}

.remove-btn {
  background-color: #ff5c5c;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: #e84f4f;
}

.cart-footer {
  margin-top: 20px;
  text-align: center;
}

.total {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
}

.checkout-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #45a049;
}

.cart-body {
  margin-top: 10px;
}

.cart-body p {
  text-align: center;
  color: #888;
}
</style>
