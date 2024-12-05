<script>
import AppNavbarVue from './AppNavbar.vue';
export default {
  components: {
    AppNavbarVue
  },
  data() {
    return {
      
    }
  }
}
</script>

<template>
    <!-- Page wrapper -->
     <div class="container-fluid">
         <div class="row">
             <div class="col-12 p-0"> 

              <!-- Waves background Header page -->
              <svg id="waves-bg"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#FF904F" fill-opacity="1" d="M0,128L48,122.7C96,117,192,107,288,106.7C384,107,480,117,576,144C672,171,768,213,864,234.7C960,256,1056,256,1152,234.7C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
              </svg>

              <!-- Navbar component -->
              <AppNavbarVue/>
            </div>
        </div>
     </div>
</template>

<style scoped lang="scss">
// Header Background image 
#waves-bg{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
</style>