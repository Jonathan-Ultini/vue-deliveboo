<template>
  <div class="checkout container">
    <h1 class="text-center my-4">Checkout</h1>

    <!-- Step 1: Carrello -->
    <div v-if="currentStep === 1">
      <div v-if="cart.items.length > 0">
        <h3 class="my-4">Carrello per {{ restaurantName }}</h3>
        <p><strong>Indirizzo:</strong> {{ restaurantAddress }}</p>
        <div class="cart-items">
          <p><strong>Piatti:</strong></p>
          <div v-for="item in cart.items" :key="item.id" class="cart-item">
            <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
          </div>
        </div>
        <div class="cart-total">
          <h4>Total: {{ totalAmount }} €</h4>
        </div>
      </div>
      <button class="btn btn-primary mt-4" @click="nextStep">Continua</button>
    </div>

    <!-- Step 2: Informazioni Ordine -->
    <div v-if="currentStep === 2">
      <div class="row">
        <!-- Form -->
        <div class="col-md-8">
          <h3>Inserisci le informazioni per l'ordine</h3>
          <form @submit.prevent="submitOrderInfo">
            <div class="mb-3">
              <label for="customer_name" class="form-label">Nome</label>
              <input v-model="orderInfo.customer_name" type="text" id="customer_name" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="customer_email" class="form-label">Email</label>
              <input v-model="orderInfo.customer_email" type="email" id="customer_email" class="form-control"
                required />
            </div>
            <div class="mb-3">
              <label for="customer_number" class="form-label">Numero telefono</label>
              <input v-model="orderInfo.customer_number" type="text" id="customer_number" class="form-control"
                required />
            </div>
            <div class="mb-3">
              <label for="customer_address" class="form-label">Indirizzo</label>
              <input v-model="orderInfo.customer_address" type="text" id="customer_address" class="form-control"
                required />
            </div>
            <button type="submit" class="btn btn-primary">Continua</button>
          </form>
        </div>

        <!-- Carrello -->
        <div class="col-md-4">
          <h4 class="my-4">Il tuo carrello</h4>
          <div v-if="cart.items.length > 0">
            <div class="cart-items">
              <div v-for="item in cart.items" :key="item.id" class="cart-item">
                <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
              </div>
            </div>
            <div class="cart-total">
              <h5>Total: {{ totalAmount }} €</h5>
            </div>
          </div>
          <div v-else>
            <p>Il carrello è vuoto.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Pagamento -->
    <div v-if="currentStep === 3">
      <h3>Pagamento</h3>
      <div class="mb-4">
        <h4>Totale da pagare: {{ totalAmount }} €</h4>
      </div>

      <!-- Un unico pulsante -->
      <button class="btn btn-primary" @click="handlePayment" :disabled="loading || (!clientToken && !dropinInstance)">
        {{ getPaymentButtonLabel }}
      </button>

      <!-- Drop-In Payment -->
      <div v-if="showDropIn" class="mt-4">
        <div id="dropin-container"></div>
      </div>
    </div>

  </div>
</template>


<script>
import dropin from 'braintree-web-drop-in'; // Importa il modulo Braintree Drop-In per la gestione dei pagamenti.
import axios from 'axios'; // Importa Axios per le richieste HTTP.

export default {
  data() {
    return {
      currentStep: 1,
      clientToken: null, // Token client di Braintree necessario per configurare il Drop-In.
      loading: false,
      cart: JSON.parse(localStorage.getItem('cart')) || { items: [] }, // Recupera il carrello dal localStorage o inizializza un carrello vuoto.
      totalAmount: 0, // Totale del carrello.
      showDropIn: false, // Indica se mostrare il widget di pagamento Drop-In.
      orderInfo: {
        customer_name: '',
        customer_email: '',
        customer_number: '',
        customer_address: '',
      },
      dropinInstance: null, // per gestire i pagamenti.
      showDropIn: false,
      restaurantName: localStorage.getItem("restaurantName") || null, // Recupera il nome del ristorante
      restaurantAddress: localStorage.getItem("restaurantAddress") || null,
    };
  },
  computed: {
    getPaymentButtonLabel() {
      if (this.loading) return "Processing...";
      return this.showDropIn ? "Pay Now" : "Proceed to Payment";
    },
  },
  async mounted() {
    // Quando il componente è montato, recupera il token client per Braintree e calcola il totale del carrello.
    await this.getClientToken();
    this.calculateTotal();
  },
  methods: {
    // Metodo per passare al prossimo step del processo.
    nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2;
      } else if (this.currentStep === 2) {
        this.currentStep = 3;
      }
    },
    // Metodo per inviare le informazioni dell'ordine al backend.
    async submitOrderInfo() {
      try {
        const response = await axios.post('http://localhost:8000/api/orders', {
          restaurant_id: this.cart.restaurantId, // ID del ristorante associato al carrello.
          customer_name: this.orderInfo.customer_name,
          customer_email: this.orderInfo.customer_email,
          customer_number: this.orderInfo.customer_number,
          customer_address: this.orderInfo.customer_address,
          total_price: this.calculateTotalPrice(), // Calcolo del prezzo totale.
        });

        if (response.status === 201) {
          console.log('Ordine salvato con successo:', response.data);
          this.nextStep();
        } else {
          alert('Errore durante il salvataggio dell\'ordine. Riprova.');
        }
      } catch (error) {
        console.error('Errore durante l\'invio dell\'ordine:', error);
        alert('Errore durante il salvataggio dell\'ordine. Riprova.');
      }
    },

    // Recupera il token client per Braintree dal backend.
    async getClientToken() {
      try {
        const response = await axios.get('http://localhost:8000/api/checkout/token');
        this.clientToken = response.data.clientToken;
      } catch (error) {
        console.error('Errore nel recupero del token:', error);
      }
    },

    // Calcola il totale del carrello sommando i prezzi di ogni articolo moltiplicati per le quantità.
    calculateTotal() {
      this.totalAmount = this.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    // Calcola e restituisce il totale del carrello come stringa con due decimali.
    calculateTotalPrice() {
      return this.cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },

    async handlePayment() {
      if (!this.showDropIn) {
        // Step 1: Mostra il Drop-In
        this.showDropIn = true;
        this.startPayment(); // Avvia il processo di pagamento
      } else {
        // Step 2: Conferma il pagamento
        this.submitPayment(); // Invia il pagamento
      }
    },

    async startPayment() {
      // Inizializza il client token e il drop-in (se non già fatto)
      this.loading = true;
      try {
        if (!this.clientToken) {
          // Richiedi il token dal server
          const response = await axios.get("/api/payment/token");
          this.clientToken = response.data.token;
        }

        // Inizializza il drop-in
        if (!this.dropinInstance) {
          const braintree = await import("braintree-web-drop-in");
          this.dropinInstance = await braintree.create({
            authorization: this.clientToken,
            container: "#dropin-container",
          });
        }
      } catch (error) {
        console.error("Errore nell'avvio del pagamento:", error);
      } finally {
        this.loading = false;
      }
    },
    async submitPayment() {
      // Invia il pagamento
      this.loading = true;
      try {
        const { nonce } = await this.dropinInstance.requestPaymentMethod();
        // Invio del pagamento al server
        await axios.post("/api/payment/checkout", { payment_method_nonce: nonce });
        alert("Pagamento effettuato con successo!");
      } catch (error) {
        console.error("Errore nel pagamento:", error);
        alert("Si è verificato un errore durante il pagamento.");
      } finally {
        this.loading = false;
      }
    },

    // Configura l'istanza Drop-In utilizzando il token client.
    setupDropIn() {
      if (!this.clientToken) return; // Esce se il token client non è disponibile.

      dropin.create(
        {
          authorization: this.clientToken, // Utilizza il token client per autorizzare il Drop-In.
          container: '#dropin-container', // ID del contenitore HTML per il widget.
        },
        (error, instance) => {
          if (error) {
            console.error('Errore nella configurazione di Drop-In:', error);
            return;
          }
          this.dropinInstance = instance; // Salva l'istanza configurata.
        }
      );
    },

    // Gestisce il processo di pagamento.
    async submitPayment() {
      if (!this.dropinInstance) {
        alert('Drop-In non configurato correttamente.');
        return;
      }

      this.loading = true; // Imposta lo stato di caricamento.

      // Richiede il metodo di pagamento dall'istanza Drop-In.
      this.dropinInstance.requestPaymentMethod(async (error, payload) => {
        if (error) {
          console.error('Errore nella richiesta del metodo di pagamento:', error);
          this.loading = false;
          return;
        }

        try {
          const response = await axios.post('http://localhost:8000/api/checkout/pay', {
            payment_method_nonce: payload.nonce, // Nonce generato da Braintree.
            amount: this.totalAmount, // Importo totale del pagamento.
          });

          if (response.data.success) {
            alert('Pagamento riuscito! Transaction ID: ' + response.data.transaction_id);

            // Svuota il carrello dopo un pagamento riuscito.
            this.cart.items = [];
            localStorage.setItem('cart', JSON.stringify(this.cart));

            // Naviga alla homepage dopo una breve pausa per mostrare l'alert.
            setTimeout(() => {
              this.$router.push({ name: 'payment-succeeded' });
            }, 1000);
          } else {
            alert('Errore durante il pagamento: ' + response.data.message);
          }
        } catch (error) {
          console.error('Errore durante il pagamento:', error);
        } finally {
          this.loading = false; // Reimposta lo stato di caricamento.
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
