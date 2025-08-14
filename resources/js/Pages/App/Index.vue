<script setup>
import BottomUserNav from '@/Components/App/BottomUserNav.vue';
import { onMounted, ref } from 'vue';

const activeScreen = ref('Dashboard');

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
      {{ activeScreen }}
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
