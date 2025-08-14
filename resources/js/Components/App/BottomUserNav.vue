<script setup>
import gsap from 'gsap';
import { nextTick, onMounted, ref, watch } from 'vue';

let lastTabChange = 0;
const tabChangeCooldown = 500;

const props = defineProps({
  activeScreen: { type: String, default: 'Dashboard' },
});
const emit = defineEmits(['changeScreen']);

const tabs = [
  {
    icon: 'house-simple',
    name: 'Dashboard',
    activeStyle: 'fill',
    inactiveStyle: 'regular',
  },
  {
    icon: 'clock-counter-clockwise',
    name: 'History',
    activeStyle: 'bold',
    inactiveStyle: 'regular',
  },
  {
    icon: 'nut',
    name: 'Settings',
    activeStyle: 'fill',
    inactiveStyle: 'regular',
  },
];

const activeIndex = ref(0);
const mainSliderCircle = ref(null);
const mainNavWrapper = ref(null);
const mainSlider = ref(null);
const bottomNav = ref(null);
const translateX = ref(0);

function updateSliderPosition(index) {
  const liElements = mainNavWrapper.value.querySelectorAll('li');
  if (!liElements.length) return;

  const activeEl = liElements[index];
  const sliderEl = mainSliderCircle.value;
  const buttonCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;

  translateX.value = buttonCenter - sliderEl.offsetWidth / 2;
}

function setActiveTab(index) {
  const now = Date.now();

  if (now - lastTabChange < tabChangeCooldown) {
    return;
  }

  lastTabChange = now;

  activeIndex.value = index;
  emit('changeScreen', tabs[index].name);

  const circle = mainSliderCircle.value;
  circle.classList.remove('animate-jello');
  void circle.offsetWidth;
  circle.classList.add('animate-jello');

  updateSliderPosition(index);
}

watch(
  () => props.activeScreen,
  (val) => {
    nextTick(() => {
      if (!mainNavWrapper.value) return;
      const index = tabs.findIndex((t) => t.name === val);
      if (index !== -1) {
        activeIndex.value = index;
        updateSliderPosition(index);
      }
    });
  },
  { immediate: true },
);

onMounted(() => {
  nextTick(() => {
    if (!mainNavWrapper.value) return;
    updateSliderPosition(activeIndex.value);
    gsap.from(bottomNav.value, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.4)',
    });

    gsap.from(mainSliderCircle.value, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.3,
    });

    const buttons = mainNavWrapper.value.querySelectorAll('button');
    gsap.from(buttons, {
      scale: 0.85,
      duration: 0.4,
      ease: 'back.out(1.7)',
      stagger: 0.1,
      delay: 0.2,
    });

    window.addEventListener('resize', () => {
      updateSliderPosition(activeIndex.value);
    });
  });
});
</script>

<template>
  <nav class="user-bottom-bar" ref="bottomNav">
    <article class="main-nav-container">
      <ul class="main-nav-wrapper" ref="mainNavWrapper">
        <li v-for="(tab, i) in tabs" :key="i">
          <button class="round-button" :class="{ active: activeIndex === i }" @click="setActiveTab(i)">
            <i :class="[
              'ph',
              `ph-${activeIndex === i ? tab.activeStyle : tab.inactiveStyle}`,
              `ph-${tab.icon}`,
            ]"></i>
          </button>
        </li>
      </ul>
      <div class="main-slider" ref="mainSlider" aria-hidden="true"
        :style="{ transform: `translateX(${translateX}px)` }">
        <div class="main-slider-circle" ref="mainSliderCircle"></div>
      </div>
    </article>
  </nav>
</template>

<style>
.user-bottom-bar {
  --circle-size: 4rem;

  @apply fixed bottom-0 left-0 w-full border-t-2 border-neutral-200 bg-white;
  height: 100px;

  .round-button i {
    transition: font-size 0.25s ease-in-out;
  }

  .round-button.active i {
    @apply text-primary;
    font-size: 32px;
  }

  .round-button:not(.active) i {
    @apply text-gray-600;
    font-size: 24px;
  }

  .main-nav-container {
    @apply mx-auto w-full pt-4;
    max-width: 500px;
    position: relative;
  }

  .main-nav-wrapper {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    padding: 0 1.5rem;

    li {
      z-index: 1;
    }
  }

  .round-button {
    @apply text-gray-600;
    height: var(--circle-size);
    width: var(--circle-size);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .main-slider {
    @apply top-4;
    pointer-events: none;
    position: absolute;
    left: 0;
    transition: transform 0.4s ease-in-out;
  }

  .main-slider-circle {
    @apply bg-neutral-300;
    height: var(--circle-size);
    width: var(--circle-size);
    border-radius: 50%;
  }
}

.animate-jello {
  animation: jello-horizontal 0.9s both;
}

@keyframes jello-horizontal {
  0% {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
