<template>
  <div class="checkout container">
    <h1 class="text-center my-4">Checkout</h1>

    <!-- Step 1: Carrello -->
    <div v-if="currentStep === 1">
      <div v-if="cart.items.length > 0">
        <h3 class="my-4">Cart for {{ cart.restaurantName }}</h3>
        <p><strong>Address:</strong> {{ cart.restaurantAddress }}</p>
        <div class="cart-items">
          <p><strong>Dishes:</strong></p>
          <div v-for="item in cart.items" :key="item.id" class="cart-item">
            <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
          </div>
        </div>
        <div class="cart-total">
          <h4>Total: {{ totalCount }} €</h4>
        </div>
      </div>
      <div v-if="cart.items && cart.items.length === 0">
        <p class="text-center">Your cart is empty. Explore the menu to start ordering!</p>
        <button class="btn btn-primary" @click="cancel">Go to Homepage</button>
      </div>
      <div v-else>
        <button class="btn btn-primary" @click="nextStep">Continue</button>
        <button class="btn btn-secondary m-2" @click="cancel">Cancel</button>
      </div>

    </div>

    <!-- Step 2: Informazioni Ordine -->
    <div v-if="currentStep === 2">
      <!-- Modulo e riepilogo -->
      <div class="row">
        <div class="col-md-8">
          <h3>Enter your order information</h3>
          <form @submit.prevent="saveOrderInfo">
            <div class="mb-3">
              <label for="customer_name" class="form-label">Name*</label>
              <input v-model="orderInfo.customer_name" type="text" id="customer_name" class="form-control" />
              <div v-if="errors.customer_name" class="text-danger">{{ errors.customer_name }}</div>
            </div>
            <div class="mb-3">
              <label for="customer_email" class="form-label">Email*</label>
              <input v-model="orderInfo.customer_email" type="email" id="customer_email" class="form-control" />
              <div v-if="errors.customer_email" class="text-danger">{{ errors.customer_email }}</div>
            </div>
            <div class="mb-3">
              <label for="customer_number" class="form-label">Telephone number*</label>
              <input v-model="orderInfo.customer_number" type="text" id="customer_number" class="form-control" />
              <div v-if="errors.customer_number" class="text-danger">{{ errors.customer_number }}</div>
            </div>
            <div class="mb-3">
              <label for="customer_address" class="form-label">Address*</label>
              <input v-model="orderInfo.customer_address" type="text" id="customer_address" class="form-control" />
              <div v-if="errors.customer_address" class="text-danger">{{ errors.customer_address }}</div>
            </div>
            <button type="submit" class="btn btn-primary">Continue</button>
          </form>
        </div>
        <div class="col-md-4">
          <h4 class="my-4">Cart summary</h4>
          <div v-for="item in cart.items" :key="item.id">
            <p><strong>{{ item.name }}</strong> - {{ item.quantity }} x {{ item.price }} €</p>
          </div>
          <h5>Total: {{ totalCount }} €</h5>
        </div>
      </div>
    </div>

    <div v-if="showErrorModal" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true"
      role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Error in the form</h5>
          </div>
          <div class="modal-body">
            <p>There are some errors in the form. Correct the highlighted fields.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="closeErrorModal">Close</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Step 3: Pagamento -->
    <div v-if="currentStep === 3">
      <h3>Payment</h3>
      <h4>Total: {{ totalCount }} €</h4>
      <button class="btn btn-primary" @click="handlePayment" :disabled="loading || (!clientToken && !dropinInstance)">
        {{ getPaymentButtonLabel }}
      </button>
      <div id="dropin-container" v-if="showDropIn"></div>
    </div>
  </div>
</template>

<script>
import dropin from 'braintree-web-drop-in'; // Importa il modulo Braintree Drop-In per la gestione dei pagamenti.
import axios from 'axios'; // Importa Axios per le richieste HTTP.
import { useCartStore } from "@/stores/cartStore";

export default {
  setup() {
    const cart = useCartStore();
    return { cart };
  },
  data() {
    return {
      showErrorModal: false,
      currentStep: 1,
      savedOrderInfo: {}, // Per salvare temporaneamente i dati dell'ordine
      cart: { items: [], restaurantId: null }, // Dati del carrello
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
      errors: {
        customer_name: '',
        customer_email: '',
        customer_number: '',
        customer_address: ''
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
    totalCount() {
      const cartStore = useCartStore(); // Accedi al CartStore
      return cartStore.cartTotal; // Usa il getter `cartTotal`
    },
  },
  async mounted() {
    // Quando il componente è montato, recupera il token client per Braintree e calcola il totale del carrello.
    await this.getClientToken();
    this.calculateTotal();
  },
  methods: {
    showErrorModalFunction() {
      // Mostra il modale
      this.showErrorModal = true;
    },
    closeErrorModal() {
      // Nasconde il modale
      this.showErrorModal = false;
    },
    saveOrderInfo() {
      // Reset errors
      this.errors = {
        customer_name: '',
        customer_email: '',
        customer_number: '',
        customer_address: ''
      };

      // Validazione dei campi
      let isValid = true;

      // Controllo Nome
      if (!this.orderInfo.customer_name.trim()) {
        this.errors.customer_name = 'The name is mandatory.';
        isValid = false;
      }

      // Controllo Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.orderInfo.customer_email.trim()) {
        this.errors.customer_email = ' The email is mandatory.';
        isValid = false;
      } else if (!emailRegex.test(this.orderInfo.customer_email)) {
        this.errors.customer_email = 'Please enter a valid email.';
        isValid = false;
      }

      // Controllo Numero Telefono 
      const phoneRegex = /^[0-9]{10}$/;
      if (!this.orderInfo.customer_number.trim()) {
        this.errors.customer_number = 'The telephone number is mandatory.';
        isValid = false;
      } else if (!phoneRegex.test(this.orderInfo.customer_number)) {
        this.errors.customer_number = 'Please enter a valid phone number (10 digits).';
        isValid = false;
      }

      // Controllo Indirizzo
      if (!this.orderInfo.customer_address.trim()) {
        this.errors.customer_address = 'The address is mandatory.';
        isValid = false;
      }

      // Se non ci sono errori, salva i dati e passa al prossimo step
      if (isValid) {
        this.savedOrderInfo = { ...this.orderInfo };
        // console.log('Dati ordine salvati temporaneamente:', this.savedOrderInfo);

        // Vai al passaggio successivo
        this.nextStep();
      } else {
        this.showErrorModalFunction(); // Mostra il modale in caso di errore
      }
    },
    // Metodo per passare al prossimo step del processo.
    nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2;
      } else if (this.currentStep === 2) {
        this.currentStep = 3;
      }
    },
    cancel() {
      this.$router.push({ name: "Home" });
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
          console.log('Order saved successfully:', response.data);
          this.nextStep();
        } else {
          alert('Error saving the order. Try again.');
        }
      } catch (error) {
        console.error('Error sending order:', error);
        alert('Error saving the order. Try again.');
      }
    },

    // Recupera il token client per Braintree dal backend.
    async getClientToken() {
      try {
        const response = await axios.get('http://localhost:8000/api/checkout/token');
        this.clientToken = response.data.clientToken;
      } catch (error) {
        console.error('Error retrieving token:', error);
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
        console.error("Error initiating payment:", error);
      } finally {
        this.loading = false;
      }
    },


    // async submitPayment() {
    //   if (!this.dropinInstance) {
    //     alert("Drop-In non configurato correttamente.");
    //     return;
    //   }
    //   // Invia il pagamento
    //   this.loading = true;
    //   try {
    //     // Richiedi il nonce dal widget Drop-In
    //     const { nonce } = await this.dropinInstance.requestPaymentMethod();
    //     // Invio del pagamento al server
    //     await axios.post("http://localhost:8000/api/payment/checkout/pay", { payment_method_nonce: nonce });
    //     alert("Pagamento effettuato con successo!");
    //   } catch (error) {
    //     console.error("Errore nel pagamento:", error);
    //     alert("Si è verificato un errore durante il pagamento.");
    //   } finally {
    //     this.loading = false;
    //   }
    // },

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
            console.error('Drop-In configuration error:', error);
            return;
          }
          this.dropinInstance = instance; // Salva l'istanza configurata.
        }
      );
    },

    // Gestisce il processo di pagamento.
    async submitPayment() {
      if (!this.dropinInstance) {
        alert("Drop-In not configured correctly.");
        return;
      }

      this.loading = true; // Stato di caricamento attivo

      try {
        // Richiedi il nonce dal widget Drop-In
        const { nonce } = await this.dropinInstance.requestPaymentMethod();

        // Invia il pagamento al backend
        const paymentResponse = await axios.post("http://localhost:8000/api/checkout/pay", {
          payment_method_nonce: nonce, // Nonce generato da Braintree
          amount: this.totalCount,
        });

        if (paymentResponse.data.success) {
          // alert("Payment successful!");

          // Invia l'ordine con i dettagli del carrello al server
          await this.submitOrder(paymentResponse.data.transaction_id);

          // Svuota il carrello e reindirizza
          this.cart.items = [];
          this.cart.restaurantAddress = null;
          this.cart.restaurantId = null;
          this.cart.restaurantName = null;
          localStorage.setItem("cart", JSON.stringify(this.cart));
          // setTimeout(() => {
          this.$router.push({ name: "payment-succeeded" });
          // }, 1000);
        } else {
          alert("Payment error: " + paymentResponse.data.message);
        }
      } catch (error) {
        console.error("Error during payment:", error);
        //alert("An error occurred during payment.");
      } finally {
        this.loading = false; // Stato di caricamento disattivato
      }
    },

    async submitOrder(transactionId) {
      // console.log('Cart:', this.cart);
      // console.log('Restaurant ID:', this.cart.restaurantId);
      // console.log('Cart Items:', this.cart.items);
      // console.log('Saved Order Info:', this.savedOrderInfo);
      // console.log('Total Amount:', this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));


      try {
        // Invia i dettagli dell'ordine, incluso il contenuto del carrello
        const response = await axios.post("http://localhost:8000/api/orders", {
          ...this.savedOrderInfo, // Informazioni aggiuntive dell'ordine
          restaurant_id: this.cart.restaurantId,
          total_price: this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Calcola il totale
          transaction_id: transactionId, // ID della transazione di pagamento
          items: this.cart.items, // Dati del carrello (piatti e quantità)
        });

        if (response.status === 201) {
          console.log("Order registered successfully:", response.data);
        } else {
          console.error("Error registering the order.");
        }
      } catch (error) {
        console.error("Error sending the order:", error);
      }
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
