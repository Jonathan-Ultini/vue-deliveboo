<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <div class="nav-wrapper">
      <ul>
        <div class="row align-items-center">

          <!-- Logo -->
          <div class="col-12 col-md-3 text-center text-md-start mb-3 mb-md-0">
            <div class="logo me-2">Home<span>boo</span></div>
          </div>

          <!-- Navbar elements LEFT -->
          <div class="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
            <div class="nav-left d-flex">
              <li class="me-3"><a href="#"><i class="fas fa-house"></i> Home</a></li>
              <li class="me-3"><a href="#"><i class="fas fa-users"></i> About</a></li>
              <li class="me-3"><a href="#"><i class="fas fa-envelope"></i> Contatti</a></li>
            </div>
          </div>

          <!-- Navbar elements RIGHT -->
          <div class="col-12 col-md-3 d-flex justify-content-center justify-content-md-end">
            <div class="nav-right d-flex">
              <li class="me-2"><a href="#"><i class="fas fa-user-pen"></i> Registrati</a></li>
              <li class="me-2"><a href="#"><i class="fas fa-arrow-right-to-bracket"></i> Accedi</a></li>
              <li><a href="#"><i class="fas fa-cart-shopping"></i></a></li>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

// Custom default yellow 
$custom-yellow: rgb(255, 214, 58);

// Logo 
.logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem; 
  font-weight: bold;
  color: rgb(255, 239, 162); 
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  display: inline-block;
  transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.logo span {
  color: rgb(235, 82, 35); 
  display: inline-block;
  transform-origin: center;
}

.logo:hover {
  transform: scale(1.1) rotate(-2deg);
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 165, 0, 0.5);

  cursor: url("../assets/img/cursorPointer.png"), auto 
}

.logo:active {
  transform: scale(0.95) rotate(2deg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

// Navbar
.nav-wrapper{
  margin: 25px auto;
  max-width: 77%;
}

// Unordered List, ul elements
ul li {
  list-style: none;
}

a{
  padding: 7px 12px;

  color: black;
  text-decoration: none;
  background-color: $custom-yellow;
  border-radius: 15px;

  display: inline-block;
  transition: transform 0.5s ease, background-color 0.3s ease, box-shadow 0.3s ease; // Aggiungi altre proprietà
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

a:hover{
  transform: scale(1.05);
  background-color: rgb(255, 240, 170);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);

     // Custom cursor hover 
     cursor: url("../assets/img/cursorPointer.png"), auto 
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
  max-width: 130px;
}
</style>