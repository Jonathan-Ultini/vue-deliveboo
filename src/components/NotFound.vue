<template>
  <div class="not-found d-flex flex-column align-items-center justify-content-center vh-100">
    <h1 class="display-1 text-primary">404</h1>
    <p class="lead text-muted">The page you are looking for does not exist.</p>
    <router-link to="/" class="btn btn-primary">Return to Home</router-link>
  </div>
</template>

<style>
.not-found {
  text-align: center;
}
</style>
