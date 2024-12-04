<template>
  <footer class="bg-dark text-white py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h5>Chi siamo</h5>
          <div class="d-flex justify-content-center mt-3">
            <div class="me-4">
              <img src="https://avatars.githubusercontent.com/u/173849681?v=4" alt="Dev 1"
                class="img-fluid rounded-circle" />
              <div>
                <p>Jonathan Ultini</p>
                <a href="https://github.com/Jonathan-Ultini" target="_blank" class="text-white">GitHub</a>
              </div>
            </div>
            <div class="me-4">
              <img src="https://avatars.githubusercontent.com/u/173928171?v=4" alt="Dev 2"
                class="img-fluid rounded-circle" />
              <div>
                <p>Marco Guarnera</p>
                <a href="https://github.com/Marco-Guarnera" target="_blank" class="text-white">GitHub</a>
              </div>
            </div>
            <div class="me-4">
              <img src="https://avatars.githubusercontent.com/u/171725649?v=4" alt="Dev 3"
                class="img-fluid rounded-circle" />
              <div>
                <p>Manuel Feliz</p>
                <a href="https://github.com/JoseManuel-Feliz" target="_blank" class="text-white">GitHub</a>
              </div>
            </div>
            <div class="me-4">
              <img src="https://avatars.githubusercontent.com/u/172858786?v=4" alt="Dev 4"
                class="img-fluid rounded-circle" />
              <div>
                <p>Salvatore Giacomazzo</p>
                <a href="https://github.com/SalvatoreGiacomazzo" target="_blank" class="text-white">GitHub</a>
              </div>
            </div>
            <div class="me-4">
              <img src="https://avatars.githubusercontent.com/u/171201254?v=4" alt="Dev 5"
                class="img-fluid rounded-circle" />
              <div>
                <p>Andrea Gulli</p>
                <a href="https://github.com/GulliWeb" target="_blank" class="text-white">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
footer {
  background-color: #F8F9FA;
}

footer .img-fluid {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

footer a {
  display: block;
  margin-top: 10px;
  color: #ffffff;
  text-decoration: none;
}

footer a:hover {
  color: #ccc;
}
</style>
