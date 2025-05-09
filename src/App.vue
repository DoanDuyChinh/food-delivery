<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <div class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Navbar from './components/common/Navbar.vue';
import Footer from './components/common/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    authStore.setToken(token);
    authStore.fetchUserProfile();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
