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
      <li><a href="#"><i class="fas fa-house"></i> Home</a></li>
      <li><a href="#"><i class="fas fa-users"></i> About</a></li>
      <li><a href="#"><i class="fas fa-envelope"></i> Contatti</a></li>
      <li><a href="#"><i class="fas fa-user-pen"></i> Registrati</a></li>
      <li><a href="#"><i class="fas fa-arrow-right-to-bracket"></i> Accedi</a></li>
      <li><a href="#"><i class="fas fa-cart-shopping"></i> Carrello</a></li>

    </ul> 
  </div>
</template>

<style scoped lang="scss">
// Custom default yellow 
$custom-yellow: rgb(255, 214, 58);

// Navbar
.nav-wrapper{
  margin: 40px auto;
  max-width: 90%;
}

// Unordered List

ul li {
  list-style: none;
}

a{
  padding: 10px 15px;
  text-decoration: none;
  background-color: $custom-yellow;
  border-radius: 15px;

  display: inline-block;
  transition: transform 0.5s ease;
}

a:hover{
  transform: scale(1.05);
}

i{
  margin-right: 5px;
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