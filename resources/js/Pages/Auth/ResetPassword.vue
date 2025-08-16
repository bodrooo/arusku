<script setup>
import ToastWrapper from '@/Components/ToastWrapper.vue';
import { pushToast } from '@/lib/toastStack';
import { useForm } from '@inertiajs/vue3';
import gsap from 'gsap';
import { onMounted, onUnmounted } from 'vue';

// Props dari route Laravel Breeze
const props = defineProps({
  email: String,
  token: String,
});

// Form
const form = useForm({
  email: props.email || '',
  token: props.token || '',
  password: '',
  password_confirmation: '',
});

let ctx;
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.rp-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.rp-form', {
      y: 20,
      opacity: 0,
      delay: 0.2,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.from('.rp-button, .rp-link', {
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
  if (!form.password || !form.password_confirmation) {
    pushToast({
      title: 'Reset Password',
      message: 'Password dan konfirmasi wajib diisi!',
      type: 'error',
    });
    return;
  }

  if (form.password !== form.password_confirmation) {
    pushToast({
      title: 'Reset Password',
      message: 'Password tidak sama!',
      type: 'error',
    });
    return;
  }

  form.post('/reset-password', {
    onSuccess: () => {
      pushToast({
        title: 'Sukses',
        message: 'Kata sandimu berhasil diperbarui! Silakan login.',
        type: 'success',
      });
    },
    onError: (errors) => {
      pushToast({
        title: 'Error',
        message: errors.email || errors.password || 'Gagal reset password!',
        type: 'error',
      });
    },
  });
}
</script>

<template>
  <section class="rp-wrapper">
    <!-- Background -->
    <div class="rp-background">
      <div class="rp-background-header"></div>
      <div class="rp-background-reverse-corner"></div>
    </div>

    <!-- Header -->
    <header class="rp-header">
      <h1 class="rp-header-title">Reset Kata Sandi</h1>
      <p class="rp-header-subtitle">Masukkan password barumu</p>
    </header>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="rp-form">
      <!-- Email -->
      <div class="rp-form-group">
        <label class="rp-form-label">Email</label>
        <div class="rp-input-container">
          <i class="ph ph-envelope rp-icon"></i>
          <input
            v-model="form.email"
            type="email"
            readonly
            class="rp-form-input cursor-not-allowed bg-gray-100"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="rp-form-group">
        <label class="rp-form-label">Password Baru</label>
        <div class="rp-input-container">
          <i class="ph ph-lock rp-icon"></i>
          <input
            v-model="form.password"
            type="password"
            placeholder="Masukkan password baru"
            class="rp-form-input"
            autocomplete="new-password"
          />
        </div>
        <div v-if="form.errors.password" class="mt-1 text-xs text-red-500">
          {{ form.errors.password }}
        </div>
      </div>

      <!-- Konfirmasi Password -->
      <div class="rp-form-group">
        <label class="rp-form-label">Konfirmasi Password</label>
        <div class="rp-input-container">
          <i class="ph ph-lock-key rp-icon"></i>
          <input
            v-model="form.password_confirmation"
            type="password"
            placeholder="Ulangi password baru"
            class="rp-form-input"
            autocomplete="new-password"
          />
        </div>
      </div>

      <!-- Button -->
      <button
        type="submit"
        class="rp-button disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="form.processing"
      >
        <span v-if="form.processing">Menyimpan...</span>
        <span v-else>Reset Password</span>
      </button>
    </form>

    <!-- Link -->
    <div class="rp-link-container">
      <a href="/login" class="rp-link">Kembali ke Login</a>
    </div>

    <ToastWrapper />
  </section>
</template>

<style>
/* Wrapper */
.rp-wrapper {
  @apply relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background;
}

/* Background */
.rp-background {
  @apply absolute left-0 top-0 z-0 w-full bg-primary;
  height: 45%;
  border-radius: 0 0 0 50px;
}

/* Header */
.rp-header {
  @apply z-10 mb-6 text-center text-background;
}

.rp-header-title {
  @apply text-2xl font-bold drop-shadow-lg;
}

.rp-header-subtitle {
  @apply mt-1 text-sm drop-shadow-lg;
}

/* Form */
.rp-form {
  @apply z-10 w-full max-w-sm rounded-xl bg-white/95 p-6 shadow-card backdrop-blur-md;
}

.rp-form-group {
  @apply mb-4;
}

.rp-form-label {
  @apply mb-1 block text-sm font-medium text-gray-700;
}

.rp-input-container {
  @apply relative flex items-center;
}

.rp-form-input {
  @apply w-full rounded-lg border p-2 pl-10 text-sm focus:border-primary focus:ring-primary;
}

.rp-icon {
  @apply absolute left-3 text-lg text-gray-500;
}

/* Button */
.rp-button {
  @apply w-full rounded-lg bg-primary p-2 text-center font-medium text-white hover:bg-blue-600;
}

/* Link */
.rp-link-container {
  @apply z-10 mt-4 text-center;
}

.rp-link {
  @apply text-sm text-gray-700 drop-shadow-lg hover:underline;
}
</style>
