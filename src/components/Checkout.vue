<template>
  <div class="checkout">
    <h1 class="text-center">Checkout</h1>
    <div id="dropin-container"></div>
    <button class="btn btn-primary" @click="submitPayment" :disabled="loading">
      {{ loading ? 'Processing...' : 'Pay Now' }}
    </button>
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
      amount: 50.0, //test importo
    };
  },
  async mounted() {
    await this.getClientToken();
    this.setupDropIn();
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
            amount: this.amount,
          });

          if (response.data.success) {
            alert('Pagamento riuscito! Transaction ID: ' + response.data.transaction_id);
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

#dropin-container {
  margin-bottom: 20px;
}
</style>
