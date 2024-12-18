<template>
  <div class="cart-sidebar">
    <div class="cart-header">
      <h3>{{ restaurantName ? `Shopping cart - ${restaurantName}` : 'Shopping cart' }}</h3>
      <button class="close-btn" @click="$emit('close')">X</button>
    </div>
    <p>{{ restaurantAddress }}</p>
    <div v-if="cartItems.length > 0" class="cart-body">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="`http://localhost:8000` + item.image" alt="Piatto" class="item-image" />
        <div class="item-details">
          <h4>{{ item.name }}</h4>
          <p class="price">Price: {{ item.price }} €</p>
          <div class="quantity-control">
            <button class="btn quantity-btn" @click="updateQuantity(item, -1)">-</button>
            <span>{{ item.quantity }}</span>
            <button class="btn quantity-btn" @click="updateQuantity(item, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="removeItem(item)">Remove</button>
      </div>
      <div class="cart-footer">
        <p class="total">Total: <strong>{{ totalCount }} €</strong></p>
        <button class="checkout-btn" @click="handleCheckout">Go to Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>The cart is empty!</p>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore';

export default {
  setup() {
    const cartStore = useCartStore(); // Usa il CartStore
    return {
      cartItems: cartStore.items, // Lista articoli del carrello
      total: cartStore.cartTotal, // Totale del carrello
      restaurantName: cartStore.restaurantName, // Nome del ristorante
      restaurantAddress: cartStore.restaurantAddress, // Indirizzo del ristorante
      updateQuantity: cartStore.updateQuantity, // Metodo per aggiornare quantità
      removeItem: cartStore.removeItem, // Metodo per rimuovere articoli
      //checkout: cartStore.checkout, // Metodo di checkout
    };
  },
  computed: {
    totalCount() {
      const cartStore = useCartStore(); // Accedi al CartStore
      return cartStore.cartTotal; // Usa il getter `cartTotal`
    },
  },
  methods: {
    handleCheckout() {
      this.checkout();
      this.$emit('close');
    },
    checkout() {
      const cartStore = useCartStore();

      if (!cartStore.items.length) {
        alert("Your cart is empty. Add some dishes before proceeding to checkout.");
        return;
      }

      // Naviga alla pagina di checkout dal componente Vue
      this.$router.push({ name: "checkout" });
    }

  }
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
