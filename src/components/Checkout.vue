<template>
  <div class="checkout">
    <h1 class="text-center">Checkout</h1>

    <!-- Step 1: Carrello -->
    <div v-if="currentStep === 1">
      <div v-if="cart.items.length > 0">
        <h3 class="my-4">Carrello</h3>
      </div>
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
        </div>
      </div>
      <div class="cart-total">
        <h4>Total: {{ totalAmount }} €</h4>
      </div>
      <button class="btn btn-primary" @click="nextStep">Continua con le informazioni ordine</button>
    </div>

    <!-- Step 2: Informazioni Ordine -->
    <div v-if="currentStep === 2">
      <h3>Inserisci le informazioni per l'ordine</h3>
      <form @submit.prevent="submitOrderInfo">
        <div class="mb-3">
          <label for="customer_name" class="form-label">Nome</label>
          <input v-model="orderInfo.customer_name" type="text" id="customer_name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="customer_email" class="form-label">Email</label>
          <input v-model="orderInfo.customer_email" type="email" id="customer_email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="customer_number" class="form-label">Numero telefono</label>
          <input v-model="orderInfo.customer_number" type="text" id="customer_number" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="customer_address" class="form-label">Indirizzo</label>
          <input v-model="orderInfo.customer_address" type="text" id="customer_address" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">Continua al pagamento</button>
      </form>
    </div>

    <!-- Step 3: Pagamento -->
    <div v-if="currentStep === 3">
      <h3>Pagamento</h3>
      <button class="btn btn-primary" @click="startPayment" :disabled="loading || !clientToken">
        {{ loading ? 'Processing...' : 'Proceed to Payment' }}
      </button>

      <!-- Quando si clicca su "Proceed to Payment", mostra il Drop-In -->
      <div v-if="showDropIn">
        <div id="dropin-container"></div>
        <button class="btn btn-primary" @click="submitPayment" :disabled="loading || !dropinInstance">
          {{ loading ? 'Processing...' : 'Pay Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dropin from 'braintree-web-drop-in';
import axios from 'axios';

export default {
  data() {
    return {
      currentStep: 1, // Step iniziale (carrello)
      clientToken: null,
      loading: false,
      cart: JSON.parse(localStorage.getItem('cart')) || { items: [] },
      totalAmount: 0, // Totale importo carrello
      showDropIn: false, // Mostrare il drop-in
      orderInfo: {
        customer_name: '',
        customer_email: '',
        customer_number: '',
        customer_address: '',
      },
      dropinInstance: null, // Inizializzare l'istanza del Drop-In
    };
  },
  async mounted() {
    await this.getClientToken();
    this.calculateTotal();
  },
  methods: {
    nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2; // Passa a step 2 (informazioni ordine)
      } else if (this.currentStep === 2) {
        this.currentStep = 3; // Passa a step 3 (pagamento)
      }
    },
    // TODO: implementare spedizione dati al backend
    async submitOrderInfo() {
      try {
        const response = await axios.post('http://localhost:8000/api/orders', {
          restaurant_id: this.cart.restaurantId,
          customer_name: this.orderInfo.customer_name,
          customer_email: this.orderInfo.customer_email,
          customer_number: this.orderInfo.customer_number,
          customer_address: this.orderInfo.customer_address,
          total_price: this.calculateTotalPrice(), // Metodo per calcolare il totale
        });

        if (response.status === 201) {
          console.log('Ordine salvato con successo:', response.data);
          this.nextStep(); // Passa al prossimo step
        } else {
          alert('Errore durante il salvataggio dell\'ordine. Riprova.');
        }
      } catch (error) {
        console.error('Errore durante l\'invio dell\'ordine:', error);
        alert('Errore durante il salvataggio dell\'ordine. Riprova.');
      }
    },

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

    calculateTotalPrice() {
      return this.cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
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
