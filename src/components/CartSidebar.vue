<template>
  <div class="cart-sidebar">
    <div class="cart-header">
      <h3>Carrello</h3>
      <button class="close-btn" @click="$emit('close')">X</button>
    </div>
    <div v-if="cart.items.length > 0" class="cart-body">
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <img :src="`http://localhost:8000` + item.image" alt="Piatto" class="item-image" />
        <div class="item-details">
          <h4>{{ item.name }}</h4>
          <p>Prezzo: {{ item.price }} €</p>
          <div class="quantity-control">
            <button @click="updateQuantity(item, -1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="removeItem(item)">Rimuovi</button>
      </div>
      <div class="cart-footer">
        <p>Totale: {{ total }} €</p>
        <button class="checkout-btn" @click="checkout">Vai al Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Il carrello è vuoto!</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cart: {
      type: Object,
      required: true,
    },
  },
  computed: {
    total() {
      return this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    },
  },
  methods: {
    updateQuantity(item, delta) {
      if (item.quantity + delta <= 0) {
        this.removeItem(item);
        return;
      }
      item.quantity += delta;
      this.emitCartUpdate();
    },
    removeItem(item) {
      this.cart.items = this.cart.items.filter((i) => i.id !== item.id);
      this.emitCartUpdate();
    },
    emitCartUpdate() {
      this.$emit('update-cart', this.cart);
    },
    checkout() {
      // Logica per il checkout
      alert('Vai al checkout!');
    },
  },
};
</script>

<style>
.cart-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item {
  display: flex;
  margin-bottom: 15px;
}

.item-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.quantity-control button {
  margin: 0 5px;
}

.cart-footer {
  margin-top: 20px;
}

.checkout-btn {
  background-color: green;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

.remove-btn {
  height: 30px;
}
</style>
