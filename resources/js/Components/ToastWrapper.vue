<script setup>
import { useToastStore } from '@/lib/toastStack';

// Ambil toasts dari store
const { toasts } = useToastStore();
</script>

<template>
  <div class="t-wrapper">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="(toast, index) in toasts"
        :key="toast.id"
        :class="`t-message t-message-${toast.id}`"
        :data-type="toast.type"
        :style="`--index: ${index};`"
      >
        <div class="t-title">{{ toast.title }}</div>
        <div class="t-message-text">{{ toast.message }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
/* Wrapper untuk stack toast */
.t-wrapper {
  @apply fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2;
}

/* Style untuk toast */
.t-message {
  @apply mt-2 rounded-lg px-4 py-2 text-white shadow-lg;
}

.t-message[data-type='error'] {
  @apply bg-red-500;
}

.t-message[data-type='success'] {
  @apply bg-green-500;
}

.t-title {
  @apply text-sm font-bold;
}

.t-message-text {
  @apply text-sm;
}

/* Animasi untuk TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  /* easeInOutBack */
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
