<template>
  <div class="checkout">
    <h1 class="text-center">Checkout</h1>

    <!-- Visualizza il carrello -->
    <div v-if="cart.items.length > 0">
      <h3 class="my-4">Carrello</h3>
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
        </div>
      </div>

      <!-- Totale del carrello -->
      <div class="cart-total">
        <h4>Total: {{ totalAmount }} €</h4>
      </div>

      <!-- Bottone per procedere al pagamento -->
      <button class="btn btn-primary" @click="startPayment" :disabled="loading">
        {{ loading ? 'Processing...' : 'Proceed to Payment' }}
      </button>
    </div>

    <!-- Quando si clicca su "Proceed to Payment", mostra il Drop-In -->
    <div v-if="showDropIn">
      <div id="dropin-container"></div>
      <button class="btn btn-primary" @click="submitPayment" :disabled="loading">
        {{ loading ? 'Processing...' : 'Pay Now' }}
      </button>
    </div>
  </div>
</template>

<script>
import dropin from 'braintree-web-drop-in';
import axios from 'axios';

export default {
  data() {
    return {
      clientToken: null,
      loading: false,
      cart: JSON.parse(localStorage.getItem('cart')) || { items: [] },
      totalAmount: 0, // Totale importo carrello
      showDropIn: false, // Mostrare il drop-in
    };
  },
  async mounted() {
    await this.getClientToken();
    this.calculateTotal();
  },
  methods: {
    async getClientToken() {
      try {
        const response = await axios.get('http://localhost:8000/api/checkout/token');
        this.clientToken = response.data.clientToken;
      } catch (error) {
        console.error('Errore nel recupero del token:', error);
      }
    },

    // Calcolare il totale del carrello
    calculateTotal() {
      this.totalAmount = this.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    // Mostrare il Drop-In
    startPayment() {
      this.showDropIn = true;
      this.setupDropIn();
    },

    setupDropIn() {
      if (!this.clientToken) return;

      dropin.create(
        {
          authorization: this.clientToken,
          container: '#dropin-container',
        },
        (error, instance) => {
          if (error) {
            console.error('Errore nella configurazione di Drop-In:', error);
            return;
          }
          this.dropinInstance = instance;
        }
      );
    },

    async submitPayment() {
      if (!this.dropinInstance) {
        alert('Drop-In non configurato correttamente.');
        return;
      }

      this.loading = true;

      this.dropinInstance.requestPaymentMethod(async (error, payload) => {
        if (error) {
          console.error('Errore nella richiesta del metodo di pagamento:', error);
          this.loading = false;
          return;
        }

        try {
          const response = await axios.post('http://localhost:8000/api/checkout/pay', {
            payment_method_nonce: payload.nonce,
            amount: this.totalAmount,
          });

          if (response.data.success) {
            alert('Pagamento riuscito! Transaction ID: ' + response.data.transaction_id);
            this.cart.items = []; // Resetta il carrello dopo il pagamento
            localStorage.setItem('cart', JSON.stringify(this.cart));

            // da dare tempo all'alert di apparire
            setTimeout(() => {
              this.$router.push({ name: 'Home' });
            }, 1000);
          } else {
            alert('Errore durante il pagamento: ' + response.data.message);
          }
        } catch (error) {
          console.error('Errore durante il pagamento:', error);
        } finally {
          this.loading = false;
        }
      });
    },
  },
};
</script>


<style scoped>
.checkout {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  margin-bottom: 10px;
}

.cart-total {
  font-weight: bold;
  margin-bottom: 20px;
}

#dropin-container {
  margin-bottom: 20px;
}
</style>
