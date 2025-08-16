<script setup>
import ToastWrapper from '@/Components/ToastWrapper.vue';
import { pushToast } from '@/lib/toastStack';
import { useForm } from '@inertiajs/vue3';
import gsap from 'gsap';
import { onMounted, onUnmounted, ref } from 'vue';

const showPassword = ref(false);

// Form login menggunakan Inertia.js
const form = useForm({
  email: '',
  password: '',
  remember: false,
});

let ctx;
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.lg-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.lg-form', {
      y: 20,
      opacity: 0,
      delay: 0.2,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.from('.lg-button, .lg-link', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out',
    });
  });
});
onUnmounted(() => ctx?.revert());

// Fungsi untuk animasi hover
function onHoverEnter(element) {
  gsap.to(element, {
    scale: 1.02,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    duration: 0.3,
    ease: 'power2.out',
  });
}

function onHoverLeave(element) {
  gsap.to(element, {
    scale: 1,
    boxShadow: 'none',
    duration: 0.3,
    ease: 'power2.out',
  });
}

// Fungsi untuk animasi klik
function onClick(element) {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
  gsap.to(element, {
    scale: 0.95,
    duration: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    },
  });
}

// Fungsi untuk submit form login
function submitForm() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!form.email || !form.password) {
    pushToast({
      message: 'Email dan kata sandi harus diisi!',
      title: 'Auth Error',
      type: 'error',
    });
    return;
  }

  if (!emailRegex.test(form.email)) {
    pushToast({
      message: 'Format email tidak valid!',
      title: 'Auth Error',
      type: 'error',
    });
    return;
  }

  form.post('/login', {
    onError: (errors) => {
      pushToast({
        message:
          errors.email || errors.password || 'Email atau kata sandi salah!',
        title: 'Auth Error',
        type: 'error',
      });
    },
  });
}
</script>

<template>
  <section class="lg-wrapper">
    <!-- Background -->
    <div class="lg-background">
      <div class="lg-background-header"></div>
      <div class="lg-background-reverse-corner"></div>
    </div>

    <!-- Header -->
    <header class="lg-header">
      <h1 class="lg-header-title">Masuk</h1>
      <p class="lg-header-subtitle">Akses aplikasi keuanganmu</p>
    </header>

    <!-- Form Login -->
    <form @submit.prevent="submitForm" class="lg-form">
      <!-- Email -->
      <div class="lg-form-group">
        <label for="email" class="lg-form-label">Email</label>
        <div class="lg-input-container">
          <i class="ph ph-envelope lg-icon"></i>
          <input
            id="email"
            v-model="form.email"
            type="text"
            inputmode="email"
            placeholder="Masukkan email"
            class="lg-form-input"
            autocomplete="email"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="lg-form-group">
        <label for="password" class="lg-form-label">Kata Sandi</label>
        <div class="lg-input-container">
          <i class="ph ph-lock lg-icon"></i>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan kata sandi"
            class="lg-form-input"
            autocomplete="current-password"
          />
          <!-- Toggle password  -->
          <button
            type="button"
            class="absolute right-3 text-lg text-gray-500"
            @click="showPassword = !showPassword"
          >
            <transition name="fade-scale" mode="out-in">
              <i v-if="showPassword" key="hide" class="ph ph-eye-slash"></i>
              <i v-else key="show" class="ph ph-eye"></i>
            </transition>
          </button>
        </div>
      </div>

      <!-- Remember me -->
      <div class="lg-checkbox-group">
        <input
          v-model="form.remember"
          type="checkbox"
          id="remember"
          class="lg-checkbox"
        />
        <label for="remember" class="lg-checkbox-label">Ingat Saya</label>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="lg-button disabled:cursor-not-allowed disabled:opacity-60"
        @click="onClick($event.currentTarget)"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
        :disabled="form.processing"
      >
        <span v-if="form.processing">Memproses...</span>
        <span v-else>Masuk</span>
      </button>
    </form>

    <!-- Link Lupa Kata Sandi -->
    <div class="lg-link-container">
      <a
        href="/forgot-password"
        class="lg-link"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        Lupa kata sandi?
      </a>
    </div>

    <!-- Link Register -->
    <div class="lg-link-container">
      <a
        href="/register"
        class="lg-link"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        Belum punya akun?
      </a>
    </div>

    <!-- Toast Notification -->
    <ToastWrapper />
  </section>
</template>
<style>
/* Wrapper Login */
.lg-wrapper {
  @apply relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background;
}

/* Background */
.lg-background {
  @apply absolute left-0 top-0 z-0 w-full bg-primary;
  height: 45%;
  border-radius: 0 0 0 50px;

  .lg-background-reverse-corner {
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
    top: 100%;
    left: calc(100% - 50px);

    &::before {
      content: '';
      display: block;
      width: 200%;
      height: 200%;
      position: absolute;
      border-radius: 50%;
      top: 0;
      right: 0;
      box-shadow: 50px -50px 0 0 theme('colors.primary');
    }
  }
}

/* Header */
.lg-header {
  @apply z-10 mb-6 text-center text-background;
}

.lg-header-title {
  @apply text-2xl font-bold drop-shadow-lg;
}

.lg-header-subtitle {
  @apply mt-1 text-sm drop-shadow-lg;
}

/* Form login */
.lg-form {
  @apply z-10 w-full max-w-sm rounded-xl bg-white/95 p-6 shadow-card backdrop-blur-md;
}

.lg-form-group {
  @apply mb-4;
}

.lg-form-label {
  @apply mb-1 block text-sm font-medium text-gray-700;
}

.lg-input-container {
  @apply relative flex items-center;
}

.lg-form-input {
  @apply w-full rounded-lg border p-2 pl-10 text-sm focus:border-primary focus:ring-primary;
}

.lg-icon {
  @apply absolute left-3 text-lg text-gray-500;
}

.lg-checkbox-group {
  @apply mb-4 flex items-center;
}

.lg-checkbox {
  @apply mr-2;
}

.lg-checkbox-label {
  @apply text-sm text-gray-700;
}

/* Tombol */
.lg-button {
  @apply w-full rounded-lg bg-primary p-2 text-center font-medium text-white hover:bg-blue-600;
}

/* Tautan */
.lg-link-container {
  @apply z-10 mt-4 text-center;
}

.lg-link {
  @apply text-sm text-gray-700 drop-shadow-lg hover:underline;
}

/* Animasi Fade */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
