<script setup>
import { closeTop, pop, push } from '@/lib/modalStack.ts';
import { gsap } from 'gsap';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'center', 'bottom'].includes(value),
  },
});

const emit = defineEmits(['update:show']);

const modalOverlay = ref(null);
const modalContent = ref(null);
let tlModal;
let startY = 0;
let currentY = 0;
let isDragging = false;

const closeModal = () => {
  emit('update:show', false);
};

const getAnimationFrom = () => {
  if (props.position === 'top') {
    return { y: '-105%' };
  } else if (props.position === 'center') {
    return { scale: 0.8, opacity: 0, y: '0%' };
  }
  return { y: '105%' };
};

const getAnimationTo = () => {
  if (props.position === 'center') {
    return { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' };
  }
  return { y: '0%', duration: 0.35, ease: 'power3.out' };
};

watch(
  () => props.show,
  (newVal) => {
    if (!tlModal) return;

    const appMain = document.querySelector('#app');
    if (newVal) {
      gsap.set(modalOverlay.value, { display: 'flex' });
      gsap.to(appMain, {
        scale: 0.96,
        filter: 'blur(3px)',
        duration: 0.3,
        ease: 'power2.out',
      });
      tlModal.play();
      push(closeModal);
    } else {
      gsap.to(appMain, {
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.3,
        ease: 'power2.out',
      });
      tlModal.reverse();
      pop();
    }
  },
);

onMounted(() => {
  tlModal = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      gsap.set(modalOverlay.value, { display: 'none' });
    },
  });

  tlModal
    .fromTo(
      modalOverlay.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' },
    )
    .fromTo(modalContent.value, getAnimationFrom(), getAnimationTo(), '<');

  // Swipe to close (tetap hanya berfungsi untuk posisi bottom)
  modalContent.value.addEventListener('touchstart', (e) => {
    if (props.position !== 'bottom') return;
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  modalContent.value.addEventListener('touchmove', (e) => {
    if (props.position !== 'bottom' || !isDragging) return;
    e.preventDefault();

    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      gsap.to(modalContent.value, { y: diff, duration: 0 });
    }
  });

  modalContent.value.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diff = currentY - startY;
    if (diff > 100) {
      closeModal();
    } else {
      gsap.to(modalContent.value, { y: 0, duration: 0.2, ease: 'power2.out' });
    }
  });
});

onUnmounted(() => {
  if (tlModal) tlModal.kill();
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="modalOverlay"
      class="base-modal-overlay"
      @click.self.stop="closeTop"
      :class="{
        'items-start': props.position === 'top',
        'items-center justify-center': props.position === 'center',
        'items-end': props.position === 'bottom',
      }"
    >
      <div
        ref="modalContent"
        class="base-modal-content"
        :class="{
          'rounded-b-3xl rounded-t-none': props.position === 'top',
          'rounded-3xl': props.position === 'center',
          'rounded-b-none rounded-t-3xl': props.position === 'bottom',
        }"
        role="dialog"
        aria-modal="true"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style>
.base-modal-overlay {
  @apply fixed inset-0 flex bg-black/50 backdrop-blur-sm;
  display: none;
  z-index: 999999999;
}

.base-modal-content {
  @apply relative mx-auto flex flex-col overscroll-contain bg-white p-4;
  max-height: 90vh;
  width: 100%;
}

.base-modal-overlay.items-center .base-modal-content {
  @apply w-11/12 max-w-lg rounded-3xl;
}

.base-modal-overlay.items-start .base-modal-content {
  @apply rounded-b-3xl;
}

.base-modal-overlay.items-end .base-modal-content {
  @apply rounded-t-3xl;
  transform: translateY(100%);
}

.base-modal-content::before {
  content: '';
  @apply mx-auto mb-3 block h-1.5 w-12 rounded-full bg-gray-300;
}

.base-modal-overlay.items-center .base-modal-content::before,
.base-modal-overlay.items-start .base-modal-content::before {
  content: none;
}
</style>
