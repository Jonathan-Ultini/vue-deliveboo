<template>
  <div class="payment-success">
    <div class="success-container">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKpySfjZRZtx5mV8ZNniz9i-4G0iKs3CCzMA&s"
        alt="Successo" class="success-icon" />
      <h1>Payment Successful!</h1>
      <p>Thanks for your order. We have received your payment and your order is being processed.</p>
      <p>You will receive a confirmation via email shortly.</p>
      <router-link to="/" class="btn">Return to the Homepage</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.payment-success {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #333;
  text-align: center;
  font-family: Arial, sans-serif;
}

.success-container {
  background: white;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: 100px;
  margin-bottom: 20px;
}

h1 {
  color: #4caf50;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
}

.btn:hover {
  background-color: #45a049;
}
</style>
