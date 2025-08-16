<script setup>
import BottomUserNav from '@/Components/App/BottomUserNav.vue';
import ToastWrapper from '@/Components/ToastWrapper.vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';

const activeScreen = ref('Dashboard');

const screens = {
  Dashboard: defineAsyncComponent(() => import('./Screen/HomeScreen.vue')),
  Activity: defineAsyncComponent(() => import('./Screen/ActivityScreen.vue')),
  Budget: defineAsyncComponent(() => import('./Screen/BudgetScreen.vue')),
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
      <ToastWrapper />
    </main>
    <BottomUserNav :activeScreen="activeScreen" @changeScreen="changeScreen" />
  </article>
</template>

<style>
:root,
html,
body {
  overscroll-behavior-y: contain;
}

body {
  @apply h-dvh bg-background;
}

.app-content {
  position: relative;
  height: calc(100dvh - var(--bottom-nav-height));
  overflow: auto;
}
</style>
