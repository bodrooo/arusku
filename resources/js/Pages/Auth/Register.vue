<script setup>
import ToastWrapper from '@/Components/ToastWrapper.vue';
import { pushToast } from '@/lib/toastStack';
import { useForm } from '@inertiajs/vue3';
import gsap from 'gsap';
import { onMounted, onUnmounted, ref } from 'vue';

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

let ctx;
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.rg-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.rg-form', {
      y: 20,
      opacity: 0,
      delay: 0.2,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.from('.rg-button, .rg-link', {
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

  if (
    !form.name ||
    !form.email ||
    !form.password ||
    !form.password_confirmation
  ) {
    pushToast({
      title: 'Register Error',
      message: 'Semua field harus diisi!',
      type: 'error',
    });
    return;
  }

  if (!emailRegex.test(form.email)) {
    pushToast({
      title: 'Register Error',
      message: 'Format email tidak valid!',
      type: 'error',
    });
    return;
  }

  if (form.password !== form.password_confirmation) {
    pushToast({
      title: 'Register Error',
      message: 'Konfirmasi kata sandi tidak sesuai!',
      type: 'error',
    });
    return;
  }

  form.post('/register', {
    onError: (errors) => {
      pushToast({
        title: 'Register Error',
        message: errors.email || errors.password || 'Pendaftaran gagal!',
        type: 'error',
      });
    },
  });
}
</script>

<template>
  <section class="rg-wrapper">
    <div class="rg-background">
      <div class="rg-background-header"></div>
      <div class="rg-background-reverse-corner"></div>
    </div>

    <!-- Header -->
    <header class="rg-header">
      <h1 class="rg-header-title">Daftar</h1>
      <p class="rg-header-subtitle">Buat akun barumu</p>
    </header>

    <!-- Form Register -->
    <form @submit.prevent="submitForm" class="rg-form">
      <!-- Nama -->
      <div class="rg-form-group">
        <label for="name" class="rg-form-label">Nama Lengkap</label>
        <div class="rg-input-container">
          <i class="ph ph-user rg-icon"></i>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Masukkan nama lengkap"
            class="rg-form-input"
          />
        </div>
        <div v-if="form.errors.name" class="mt-1 text-xs text-red-500">
          {{ form.errors.name }}
        </div>
      </div>

      <!-- Email -->
      <div class="rg-form-group">
        <label for="email" class="rg-form-label">Email</label>
        <div class="rg-input-container">
          <i class="ph ph-envelope rg-icon"></i>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Masukkan email"
            class="rg-form-input"
            autocomplete="email"
          />
        </div>
        <div v-if="form.errors.email" class="mt-1 text-xs text-red-500">
          {{ form.errors.email }}
        </div>
      </div>

      <!-- Password -->
      <div class="rg-form-group">
        <label for="password" class="rg-form-label">Kata Sandi</label>
        <div class="rg-input-container">
          <i class="ph ph-lock rg-icon"></i>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Buat kata sandi"
            class="rg-form-input"
            autocomplete="new-password"
          />
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
        <div v-if="form.errors.password" class="mt-1 text-xs text-red-500">
          {{ form.errors.password }}
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="rg-form-group">
        <label for="password_confirmation" class="rg-form-label"
          >Konfirmasi Kata Sandi</label
        >
        <div class="rg-input-container">
          <i class="ph ph-lock rg-icon"></i>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            :type="showPasswordConfirm ? 'text' : 'password'"
            placeholder="Ulangi kata sandi"
            class="rg-form-input"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="absolute right-3 text-lg text-gray-500"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <transition name="fade-scale" mode="out-in">
              <i
                v-if="showPasswordConfirm"
                key="hidec"
                class="ph ph-eye-slash"
              ></i>
              <i v-else key="showc" class="ph ph-eye"></i>
            </transition>
          </button>
        </div>
      </div>

      <!-- Tombol Submit -->
      <button
        type="submit"
        class="rg-button disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="form.processing"
      >
        <span v-if="form.processing">Mendaftarkan...</span>
        <span v-else>Daftar</span>
      </button>
    </form>

    <!-- Link Login -->
    <div class="rg-link-container">
      <a href="/login" class="rg-link">Sudah punya akun? Masuk</a>
    </div>

    <ToastWrapper />
  </section>
</template>

<style>
.rg-wrapper {
  @apply relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background;
}

.rg-background {
  @apply absolute left-0 top-0 z-0 w-full bg-primary;
  height: 45%;
  border-radius: 0 0 0 50px;
}

.rg-header {
  @apply z-10 mb-6 text-center text-background;
}

.rg-header-title {
  @apply text-2xl font-bold drop-shadow-lg;
}

.rg-header-subtitle {
  @apply mt-1 text-sm drop-shadow-lg;
}

.rg-form {
  @apply z-10 w-full max-w-sm rounded-xl bg-white/95 p-6 shadow-card backdrop-blur-md;
}

.rg-form-group {
  @apply mb-4;
}

.rg-form-label {
  @apply mb-1 block text-sm font-medium text-gray-700;
}

.rg-input-container {
  @apply relative flex items-center;
}

.rg-form-input {
  @apply w-full rounded-lg border p-2 pl-10 text-sm focus:border-primary focus:ring-primary;
}

.rg-icon {
  @apply absolute left-3 text-lg text-gray-500;
}

.rg-button {
  @apply w-full rounded-lg bg-primary p-2 text-center font-medium text-white hover:bg-blue-600;
}

.rg-link-container {
  @apply z-10 mt-4 text-center;
}

.rg-link {
  @apply text-sm text-gray-700 drop-shadow-lg hover:underline;
}

/* Animasi fade/scale untuk toggle eye icon */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
