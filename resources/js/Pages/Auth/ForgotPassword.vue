<script setup>
import ToastWrapper from '@/Components/ToastWrapper.vue';
import { pushToast } from '@/lib/toastStack';
import { useForm } from '@inertiajs/vue3';
import gsap from 'gsap';
import { onMounted, onUnmounted } from 'vue';

const form = useForm({
  email: '',
});

let ctx;
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.fp-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.fp-form', {
      y: 20,
      opacity: 0,
      delay: 0.2,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.from('.fp-button, .fp-link', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out',
    });
  });
});
onUnmounted(() => ctx?.revert());

function submitForm() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!form.email) {
    pushToast({
      title: 'Forgot Password',
      message: 'Email harus diisi!',
      type: 'error',
    });
    return;
  }

  if (!emailRegex.test(form.email)) {
    pushToast({
      title: 'Forgot Password',
      message: 'Format email tidak valid!',
      type: 'error',
    });
    return;
  }

  form.post('/forgot-password', {
    onSuccess: () => {
      pushToast({
        title: 'Sukses',
        message: 'Kami sudah mengirimkan link reset ke emailmu!',
        type: 'success',
      });
    },
    onError: (errors) => {
      pushToast({
        title: 'Error',
        message: errors.email || 'Gagal mengirim permintaan reset!',
        type: 'error',
      });
    },
  });
}
</script>

<template>
  <section class="fp-wrapper">
    <!-- Background -->
    <div class="fp-background">
      <div class="fp-background-header"></div>
      <div class="fp-background-reverse-corner"></div>
    </div>

    <!-- Header -->
    <header class="fp-header">
      <h1 class="fp-header-title">Lupa Kata Sandi</h1>
      <p class="fp-header-subtitle">Masukkan email untuk reset kata sandi</p>
    </header>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="fp-form">
      <div class="fp-form-group">
        <label class="fp-form-label">Email</label>
        <div class="fp-input-container">
          <i class="ph ph-envelope fp-icon"></i>
          <input
            v-model="form.email"
            type="email"
            placeholder="Masukkan email terdaftar"
            class="fp-form-input"
            autocomplete="email"
          />
        </div>
        <div v-if="form.errors.email" class="mt-1 text-xs text-red-500">
          {{ form.errors.email }}
        </div>
      </div>

      <button
        type="submit"
        class="fp-button disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="form.processing"
      >
        <span v-if="form.processing">Mengirim...</span>
        <span v-else>Kirim Link Reset</span>
      </button>
    </form>

    <!-- Link -->
    <div class="fp-link-container">
      <a href="/login" class="fp-link">Kembali ke Login</a>
    </div>

    <ToastWrapper />
  </section>
</template>

<style>
/* Wrapper */
.fp-wrapper {
  @apply relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background;
}

/* Background */
.fp-background {
  @apply absolute left-0 top-0 z-0 w-full bg-primary;
  height: 45%;
  border-radius: 0 0 0 50px;
}

/* Header */
.fp-header {
  @apply z-10 mb-6 text-center text-background;
}

.fp-header-title {
  @apply text-2xl font-bold drop-shadow-lg;
}

.fp-header-subtitle {
  @apply mt-1 text-sm drop-shadow-lg;
}

/* Form */
.fp-form {
  @apply z-10 w-full max-w-sm rounded-xl bg-white/95 p-6 shadow-card backdrop-blur-md;
}

.fp-form-group {
  @apply mb-4;
}

.fp-form-label {
  @apply mb-1 block text-sm font-medium text-gray-700;
}

.fp-input-container {
  @apply relative flex items-center;
}

.fp-form-input {
  @apply w-full rounded-lg border p-2 pl-10 text-sm focus:border-primary focus:ring-primary;
}

.fp-icon {
  @apply absolute left-3 text-lg text-gray-500;
}

/* Button */
.fp-button {
  @apply w-full rounded-lg bg-primary p-2 text-center font-medium text-white hover:bg-blue-600;
}

/* Link */
.fp-link-container {
  @apply z-10 mt-4 text-center;
}

.fp-link {
  @apply text-sm text-gray-700 drop-shadow-lg hover:underline;
}
</style>
