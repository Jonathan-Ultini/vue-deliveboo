<script>
    import axios from "axios";

    export default {
        name: "AppOrderForm",
        data: () => ({
            // Endpoint
            ordersEndpoint: "http://127.0.0.1:8000/api/orders",
            // Variabili
            customerName: "",
            customerEmail: "",
            customerNumber: "",
            customerAddress: ""
        }),
        methods: {
            sendOrder() {
                const formData = {
                    customer_name: this.customerName,
                    customer_email: this.customerEmail,
                    customer_number: this.customerNumber,
                    customer_address: this.customerAddress
                }

                axios.post(this.ordersEndpoint, formData)
                    .then(response => {
                        console.log(response);
                    }).catch(error => {
                        console.log(error.response.data);
                    });
            }
        }
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
                <!-- Form -->
                <form @submit.prevent="sendOrder">
                    <!-- Customer Name -->
                    <label for="customer-name" class="form-label">Name:</label>
                    <input type="text" id="customer-name" class="form-control" v-model="customerName" name="customer_name" placeholder="Name" autofocus required>
                    <!-- Customer Email -->
                    <label for="customer-email" class="form-label">Email:</label>
                    <input type="email" id="customer-email" class="form-control" v-model="customerEmail" name="customer_email" placeholder="Email" required>
                    <!-- Customer Number -->
                    <label for="customer-number" class="form-label">Number:</label>
                    <input type="tel" id="customer-number" class="form-control" v-model="customerNumber" name="customer_number" placeholder="Number" required>
                    <!-- Customer Address -->
                    <label for="customer-address" class="form-label">Address:</label>
                    <input type="text" id="customer-address" class="form-control" v-model="customerAddress" name="customer_address" placeholder="Address" required>
                    <!-- Btns -->
                    <div class="my-3">
                        <button type="submit" class="btn btn-primary">Send</button>
                        <button type="reset" class="btn btn-secondary">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>