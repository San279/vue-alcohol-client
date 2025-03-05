<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <header class="navbar-contents">
    <Navbar />
  </header>
  <div class="router-contents">
    <RouterView :key="route.fullPath" />
  </div>
</template>

<style scoped>
.router-contents {
  margin: 0;
  margin-left: 0%;
  padding-left: 2vw;
  width: 100%;
}

.navbar-contents {
  margin-left: 0%;
  width: 100%;
  /*}*/
}
</style>
