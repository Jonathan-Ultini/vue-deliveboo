<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>

<template>
  <div class="nav-wrapper">
    <ul class="d-flex justify-content-evenly">

      <!-- Deliveboo Logo-->
      <div class="logo">
        <figure>
          <img src="../assets/img/deliveboo_logo.png" alt="">
        </figure>
      </div>

      <!-- Navbar elements -->
      <li> <i class="fas fa-house"> </i>Home</li>
      <li> <i class="fas fa-users"> </i>About</li>
      <li> <i class="fas fa-envelope"> </i>Contatti</li>
      <li> <i class="fas fa-user-pen"> </i>Registrati</li>
      <li> <i class="fas fa-arrow-right-to-bracket"> </i>Accedi</li>
      <li> <i class="fas fa-cart-shopping"> </i></li>

    </ul> 
  </div>
</template>

<style scoped lang="scss">
// Navbar Wrapper
.nav-wrapper{
  margin: 0 auto;
  max-width: 90%;
}

// Figure, img
img{
  margin: 0;
  padding: 0;
  max-width: 100%
}

figure{
  margin: 0;
  padding: 0;
  max-width: 35%;
}
</style>