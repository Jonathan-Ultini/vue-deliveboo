<template>
  <div id="app">
    <AppHeader />
    <AppMain />
    <AppFooter />
  </div>
</template>

<script>
//import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
//import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    //AppHeader,
    AppMain,
    //AppFooter,
  },
};
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
}
</style>
