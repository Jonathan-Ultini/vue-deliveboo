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
      <li><a href="#"><i class="fas fa-cart-shopping"></i></a></li>

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

// Unordered List, ul elements
ul li {
  list-style: none;
}

a{
  padding: 8px 15px;

  color: black;
  text-decoration: none;
  background-color: $custom-yellow;
  border-radius: 15px;

  display: inline-block;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease; // Aggiungi altre proprietà
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

a:hover{
  transform: scale(1.05);
  background-color: rgb(255, 240, 170);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

a:active{
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $custom-yellow;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

a:hover i {
  transform: rotate(10deg); // Rotazione leggera
  transition: transform 0.3s ease; 
}

i{
  margin-right: 4px;
}

// Figure, img
img{
  margin: 0;
  padding: 0;
  max-width: 100%;
  height: auto;
}

figure{
  margin: 0;
  padding: 0;
  max-width: 35%;
}
</style>