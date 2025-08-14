<script setup>
import BottomUserNav from '@/Components/App/BottomUserNav.vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';

const activeScreen = ref('Dashboard');

const screens = {
  Dashboard: defineAsyncComponent(() => import('./Screen/HomeScreen.vue')),
  Activity: defineAsyncComponent(() => import('./Screen/ActivityScreen.vue')),
  Settings: defineAsyncComponent(() => import('./Screen/SettingsScreen.vue')),
};

function changeScreen(screen) {
  activeScreen.value = screen;
  sessionStorage.setItem('activeScreen', screen);
}

onMounted(() => {
  const saved = sessionStorage.getItem('activeScreen');
  if (saved) activeScreen.value = saved;
});
</script>

<template>
  <article id="app-layout" class="flex h-dvh flex-col">
    <main class="app-content">
      <component :is="screens[activeScreen]" />
    </main>
    <BottomUserNav :activeScreen="activeScreen" @changeScreen="changeScreen" />
  </article>
</template>

<style>
.app-content {
  flex: 1;
  background: #f8fafc;
}
</style>
