<script setup>
import BaseModal from '@/Components/BaseModal.vue';
import gsap from 'gsap';
import { nextTick, onMounted, ref } from 'vue';

// Data akun keuangan (sama dengan HomeScreen.vue dan BudgetScreen.vue)
const accounts = ref([
  { id: 1, name: 'Bank BRI', balance: 5000000, icon: 'ph-bank' },
  { id: 2, name: 'Tunai', balance: 1500000, icon: 'ph-wallet' },
  { id: 3, name: 'GoPay', balance: 300000, icon: 'ph-credit-card' },
]);

// Data kategori transaksi
const categories = ref([
  { id: 1, name: 'Makanan', icon: 'ph-fork-knife' },
  { id: 2, name: 'Transportasi', icon: 'ph-car' },
  { id: 3, name: 'Gaji', icon: 'ph-wallet' },
]);

// Dummy data transaksi untuk cek dependensi hapus akun/kategori
const transactions = ref([
  {
    id: 1,
    name: 'Gaji Bulanan',
    amount: 5500000,
    type: 'income',
    icon: 'ph-wallet',
    account_id: 1,
    category_id: 3,
  },
  {
    id: 2,
    name: 'Belanja Bulanan',
    amount: -1200000,
    type: 'expense',
    icon: 'ph-shopping-cart',
    account_id: 2,
    category_id: 1,
  },
  {
    id: 3,
    name: 'Ngopi',
    amount: -25000,
    type: 'expense',
    icon: 'ph-coffee',
    account_id: 3,
    category_id: 1,
  },
]);

// State untuk modal, toast, dan form
const showModal = ref(false);
const modalType = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const form = ref({
  accountId: null,
  name: '',
  balance: null,
  username: '',
  email: '',
  photo: '',
  pin: '',
  categoryId: null,
});

// State untuk pengaturan
const profile = ref({
  username: 'Bodro',
  email: 'bodro@example.com',
  photo: 'https://via.placeholder.com/64', // Dummy photo URL
});
const isDarkMode = ref(false);
const notificationsEnabled = ref(true);
const budgetReminder = ref(true);
const pinEnabled = ref(false);

// Animasi masuk
onMounted(() => {
  nextTick(() => {
    gsap.from('.ss-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.ss-section', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power2.out',
    });
    gsap.from('.ss-account-item', {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      delay: 0.4,
      ease: 'power2.out',
    });
  });
});

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
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out',
  });
}

// Fungsi untuk animasi klik
function onClick(element) {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Haptic feedback untuk mobile
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

// Fungsi untuk membuka modal
function openModal(type, item = null, event) {
  modalType.value = type;
  if (type === 'edit-account' && item) {
    form.value = {
      accountId: item.id,
      name: item.name,
      balance: item.balance,
    };
  } else if (type === 'edit-profile') {
    form.value = {
      username: profile.value.username,
      email: profile.value.email,
      photo: profile.value.photo,
    };
  } else if (type === 'set-pin') {
    form.value = { pin: '' };
  } else if (type === 'add-category' || type === 'edit-category') {
    form.value =
      type === 'edit-category' && item
        ? { categoryId: item.id, name: item.name }
        : { categoryId: null, name: '' };
  } else if (type === 'about') {
    form.value = {};
  }
  showModal.value = true;
  const btn = event.currentTarget;
  onClick(btn);
  gsap.fromTo(
    '.ss-modal-content',
    { y: btn.getBoundingClientRect().top, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
  );
}

// Fungsi untuk hapus akun
function deleteAccount(id, event) {
  onClick(event.currentTarget);
  if (transactions.value.some((t) => t.account_id === id)) {
    toastMessage.value = 'Akun tidak bisa dihapus karena memiliki transaksi!';
    showToast.value = true;
    gsap.fromTo(
      '.ss-toast-message',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            showToast.value = false;
          }, 2000);
        },
      },
    );
    return;
  }
  accounts.value = accounts.value.filter((a) => a.id !== id);
  toastMessage.value = 'Akun berhasil dihapus!';
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}

// Fungsi untuk hapus kategori
function deleteCategory(id, event) {
  onClick(event.currentTarget);
  if (transactions.value.some((t) => t.category_id === id)) {
    toastMessage.value =
      'Kategori tidak bisa dihapus karena digunakan di transaksi!';
    showToast.value = true;
    gsap.fromTo(
      '.ss-toast-message',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            showToast.value = false;
          }, 2000);
        },
      },
    );
    return;
  }
  categories.value = categories.value.filter((c) => c.id !== id);
  toastMessage.value = 'Kategori berhasil dihapus!';
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}

// Fungsi untuk submit form
function submitForm() {
  if (modalType.value === 'edit-account') {
    if (!form.value.name || !form.value.balance) {
      toastMessage.value = 'Nama dan saldo harus diisi!';
      showToast.value = true;
      gsap.fromTo(
        '.ss-toast-message',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(() => {
              showToast.value = false;
            }, 2000);
          },
        },
      );
      return;
    }
    const account = accounts.value.find((a) => a.id === form.value.accountId);
    if (account) {
      account.name = form.value.name;
      account.balance = form.value.balance;
    }
    toastMessage.value = 'Akun berhasil diperbarui!';
  } else if (modalType.value === 'edit-profile') {
    if (!form.value.username || !form.value.email) {
      toastMessage.value = 'Nama dan email harus diisi!';
      showToast.value = true;
      gsap.fromTo(
        '.ss-toast-message',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(() => {
              showToast.value = false;
            }, 2000);
          },
        },
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      toastMessage.value = 'Email tidak valid!';
      showToast.value = true;
      gsap.fromTo(
        '.ss-toast-message',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(() => {
              showToast.value = false;
            }, 2000);
          },
        },
      );
      return;
    }
    profile.value = {
      username: form.value.username,
      email: form.value.email,
      photo: form.value.photo || 'https://via.placeholder.com/64',
    };
    toastMessage.value = 'Profil berhasil diperbarui!';
  } else if (modalType.value === 'set-pin') {
    if (!form.value.pin || form.value.pin.length !== 4) {
      toastMessage.value = 'PIN harus 4 digit!';
      showToast.value = true;
      gsap.fromTo(
        '.ss-toast-message',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(() => {
              showToast.value = false;
            }, 2000);
          },
        },
      );
      return;
    }
    pinEnabled.value = true;
    toastMessage.value = 'PIN berhasil diatur!';
  } else if (
    modalType.value === 'add-category' ||
    modalType.value === 'edit-category'
  ) {
    if (!form.value.name) {
      toastMessage.value = 'Nama kategori harus diisi!';
      showToast.value = true;
      gsap.fromTo(
        '.ss-toast-message',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setTimeout(() => {
              showToast.value = false;
            }, 2000);
          },
        },
      );
      return;
    }
    if (modalType.value === 'add-category') {
      categories.value.push({
        id: categories.value.length + 1,
        name: form.value.name,
        icon: 'ph-tag',
      });
      toastMessage.value = 'Kategori berhasil ditambahkan!';
    } else {
      const category = categories.value.find(
        (c) => c.id === form.value.categoryId,
      );
      if (category) {
        category.name = form.value.name;
      }
      toastMessage.value = 'Kategori berhasil diperbarui!';
    }
  }
  showModal.value = false;
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}

// Fungsi untuk toggle tema
function toggleDarkMode(event) {
  onClick(event.currentTarget);
  isDarkMode.value = !isDarkMode.value;
  toastMessage.value = `Tema ${isDarkMode.value ? 'gelap' : 'terang'} diaktifkan!`;
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}

// Fungsi untuk toggle notifikasi transaksi
function toggleNotifications(event) {
  onClick(event.currentTarget);
  notificationsEnabled.value = !notificationsEnabled.value;
  toastMessage.value = `Notifikasi transaksi ${notificationsEnabled.value ? 'diaktifkan' : 'dinonaktifkan'}!`;
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}

// Fungsi untuk toggle pengingat anggaran
function toggleBudgetReminder(event) {
  onClick(event.currentTarget);
  budgetReminder.value = !budgetReminder.value;
  toastMessage.value = `Pengingat anggaran ${budgetReminder.value ? 'diaktifkan' : 'dinonaktifkan'}!`;
  showToast.value = true;
  gsap.fromTo(
    '.ss-toast-message',
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      },
    },
  );
}
</script>

<template>
  <section class="ss-wrapper">
    <!-- Header -->
    <header class="ss-header">
      <h1 class="ss-header-title">Pengaturan</h1>
      <p class="ss-header-subtitle">Atur akun dan preferensi kamu</p>
    </header>

    <!-- Profil Pengguna -->
    <div class="ss-section">
      <h3 class="ss-section-title">Profil</h3>
      <div class="ss-account-item">
        <div class="ss-profile-container">
          <img
            :src="profile.photo"
            alt="Foto Profil"
            class="ss-profile-photo"
          />
          <div>
            <span class="ss-profile-name">{{ profile.username }}</span>
            <p class="ss-profile-email">{{ profile.email }}</p>
          </div>
        </div>
        <button
          @click="openModal('edit-profile', null, $event)"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
          class="ss-edit-button"
        >
          <i class="ph ph-pencil-simple ss-icon"></i>
        </button>
      </div>
    </div>

    <!-- Kelola Akun -->
    <div class="ss-section">
      <h3 class="ss-section-title">Akun Keuangan</h3>
      <ul>
        <li
          v-for="account in accounts"
          :key="account.id"
          class="ss-account-item"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
        >
          <div class="ss-account-container">
            <i :class="['ph', account.icon, 'ss-icon']"></i>
            <div>
              <span class="ss-account-name">{{ account.name }}</span>
              <p class="ss-account-balance">
                Saldo: Rp {{ account.balance.toLocaleString() }}
              </p>
            </div>
          </div>
          <div class="ss-account-actions">
            <button
              @click="openModal('edit-account', account, $event)"
              @mouseenter="onHoverEnter($event.currentTarget)"
              @mouseleave="onHoverLeave($event.currentTarget)"
              class="ss-edit-button"
            >
              <i class="ph ph-pencil-simple ss-icon"></i>
            </button>
            <button
              @click="deleteAccount(account.id, $event)"
              @mouseenter="onHoverEnter($event.currentTarget)"
              @mouseleave="onHoverLeave($event.currentTarget)"
              class="ss-delete-button"
            >
              <i class="ph ph-trash ss-icon"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Kategori Transaksi -->
    <div class="ss-section">
      <h3 class="ss-section-title">Kategori Transaksi</h3>
      <button
        @click="openModal('add-category', null, $event)"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
        class="ss-add-button"
      >
        Tambah Kategori
      </button>
      <ul>
        <li
          v-for="category in categories"
          :key="category.id"
          class="ss-account-item"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
        >
          <div class="ss-account-container">
            <i :class="['ph', category.icon, 'ss-icon']"></i>
            <span class="ss-account-name">{{ category.name }}</span>
          </div>
          <div class="ss-account-actions">
            <button
              @click="openModal('edit-category', category, $event)"
              @mouseenter="onHoverEnter($event.currentTarget)"
              @mouseleave="onHoverLeave($event.currentTarget)"
              class="ss-edit-button"
            >
              <i class="ph ph-pencil-simple ss-icon"></i>
            </button>
            <button
              @click="deleteCategory(category.id, $event)"
              @mouseenter="onHoverEnter($event.currentTarget)"
              @mouseleave="onHoverLeave($event.currentTarget)"
              class="ss-delete-button"
            >
              <i class="ph ph-trash ss-icon"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Pengaturan Notifikasi -->
    <div class="ss-section">
      <h3 class="ss-section-title">Notifikasi</h3>
      <div class="ss-account-item">
        <div class="ss-account-container">
          <i class="ph ph-bell ss-icon"></i>
          <span class="ss-account-name">Notifikasi Transaksi</span>
        </div>
        <button
          @click="toggleNotifications($event)"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
          class="ss-toggle-button"
        >
          <i
            :class="[
              'ph',
              notificationsEnabled ? 'ph-toggle-right' : 'ph-toggle-left',
              'ss-icon',
            ]"
          ></i>
        </button>
      </div>
      <div class="ss-account-item">
        <div class="ss-account-container">
          <i class="ph ph-bell-ringing ss-icon"></i>
          <span class="ss-account-name">Pengingat Anggaran</span>
        </div>
        <button
          @click="toggleBudgetReminder($event)"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
          class="ss-toggle-button"
        >
          <i
            :class="[
              'ph',
              budgetReminder ? 'ph-toggle-right' : 'ph-toggle-left',
              'ss-icon',
            ]"
          ></i>
        </button>
      </div>
    </div>

    <!-- Keamanan -->
    <div class="ss-section">
      <h3 class="ss-section-title">Keamanan</h3>
      <div class="ss-account-item">
        <div class="ss-account-container">
          <i class="ph ph-lock ss-icon"></i>
          <span class="ss-account-name">Atur PIN</span>
        </div>
        <button
          @click="openModal('set-pin', null, $event)"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
          class="ss-edit-button"
        >
          <i class="ph ph-pencil-simple ss-icon"></i>
        </button>
      </div>
    </div>

    <!-- Tentang Aplikasi -->
    <div class="ss-section">
      <h3 class="ss-section-title">Tentang</h3>
      <div class="ss-account-item">
        <div class="ss-account-container">
          <i class="ph ph-info ss-icon"></i>
          <span class="ss-account-name">Tentang Aplikasi</span>
        </div>
        <button
          @click="openModal('about', null, $event)"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
          class="ss-edit-button"
        >
          <i class="ph ph-caret-right ss-icon"></i>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <BaseModal v-model:show="showModal" position="center">
      <div class="ss-modal-content">
        <h2 class="ss-modal-title">
          {{
            modalType === 'edit-profile'
              ? 'Edit Profil'
              : modalType === 'edit-account'
                ? 'Edit Akun'
                : modalType === 'set-pin'
                  ? 'Atur PIN'
                  : modalType === 'add-category'
                    ? 'Tambah Kategori'
                    : modalType === 'edit-category'
                      ? 'Edit Kategori'
                      : 'Tentang Aplikasi'
          }}
        </h2>
        <form
          v-if="modalType !== 'about'"
          @submit.prevent="submitForm"
          class="ss-form"
        >
          <template v-if="modalType === 'edit-profile'">
            <div class="ss-form-group">
              <label class="ss-form-label">Nama Pengguna</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="Masukkan nama"
                class="ss-form-input"
              />
            </div>
            <div class="ss-form-group">
              <label class="ss-form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Masukkan email"
                class="ss-form-input"
              />
            </div>
            <div class="ss-form-group">
              <label class="ss-form-label">Foto Profil (URL)</label>
              <input
                v-model="form.photo"
                type="text"
                placeholder="Masukkan URL foto"
                class="ss-form-input"
              />
            </div>
          </template>
          <template v-else-if="modalType === 'edit-account'">
            <div class="ss-form-group">
              <label class="ss-form-label">Nama Akun</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Bank Mandiri"
                class="ss-form-input"
              />
            </div>
            <div class="ss-form-group">
              <label class="ss-form-label">Saldo</label>
              <input
                v-model="form.balance"
                type="number"
                placeholder="Masukkan saldo"
                class="ss-form-input"
              />
            </div>
          </template>
          <template v-else-if="modalType === 'set-pin'">
            <div class="ss-form-group">
              <label class="ss-form-label">PIN (4 Digit)</label>
              <input
                v-model="form.pin"
                type="password"
                placeholder="Masukkan PIN"
                class="ss-form-input"
                maxlength="4"
              />
            </div>
          </template>
          <template
            v-else-if="
              modalType === 'add-category' || modalType === 'edit-category'
            "
          >
            <div class="ss-form-group">
              <label class="ss-form-label">Nama Kategori</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Makanan"
                class="ss-form-input"
              />
            </div>
          </template>
          <button
            type="submit"
            class="ss-form-button"
            @click="onClick($event.currentTarget)"
          >
            Simpan
          </button>
        </form>
        <div v-else class="ss-about-content">
          <p class="ss-about-text">Aplikasi Keuangan v1.0.0</p>
          <p class="ss-about-text">
            Dibuat untuk membantu mengelola keuangan pribadi dengan mudah.
          </p>
          <p class="ss-about-text">
            Kontak dukungan: support@aplikasikeuangan.com
          </p>
          <button
            @click="showModal = false"
            @mouseenter="onHoverEnter($event.currentTarget)"
            @mouseleave="onHoverLeave($event.currentTarget)"
            class="ss-close-button"
          >
            Tutup
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Toast Notification -->
    <div v-if="showToast" class="ss-toast-message">
      {{ toastMessage }}
    </div>
  </section>
</template>

<style>
/* Wrapper utama */
.ss-wrapper {
  @apply bg-background p-4;
}

/* Header */
.ss-header {
  @apply mb-4;
}

.ss-header-title {
  @apply text-xl font-bold text-text;
}

.ss-header-subtitle {
  @apply text-sm text-gray-500;
}

/* Section */
.ss-section {
  @apply mb-6;
}

.ss-section-title {
  @apply mb-2 text-sm font-medium text-gray-500;
}

/* Profil pengguna */
.ss-profile-container {
  @apply flex items-center gap-3;
}

.ss-profile-photo {
  @apply h-10 w-10 rounded-full;
}

.ss-profile-name {
  @apply font-medium;
}

.ss-profile-email {
  @apply text-xs text-gray-500;
}

/* Item akun dan kategori */
.ss-account-item {
  @apply mb-3 flex items-center justify-between rounded-xl bg-white p-3 shadow-card;
}

.ss-account-container {
  @apply flex items-center gap-3;
}

.ss-account-name {
  @apply font-medium;
}

.ss-account-balance {
  @apply text-xs text-gray-500;
}

.ss-account-actions {
  @apply flex gap-2;
}

.ss-icon {
  @apply text-lg;
}

/* Tombol */
.ss-edit-button {
  @apply text-gray-500;
}

.ss-edit-button:hover {
  @apply text-blue-500;
}

.ss-delete-button {
  @apply text-gray-500;
}

.ss-delete-button:hover {
  @apply text-red-500;
}

.ss-toggle-button {
  @apply text-gray-500;
}

.ss-add-button {
  @apply mb-3 w-full rounded-lg bg-primary p-2 text-center text-white;
}

/* Modal */
.ss-modal-content {
  @apply p-4;
}

.ss-modal-title {
  @apply mb-3 text-lg font-bold;
}

.ss-form {
  @apply space-y-3;
}

.ss-form-group {
  @apply mb-3;
}

.ss-form-label {
  @apply block text-sm font-medium;
}

.ss-form-input {
  @apply w-full rounded-lg border p-2;
}

.ss-form-button {
  @apply w-full rounded-lg bg-primary p-2 text-white;
}

.ss-about-content {
  @apply space-y-3;
}

.ss-about-text {
  @apply mb-3;
}

.ss-close-button {
  @apply w-full rounded-lg bg-gray-500 p-2 text-white;
}

/* Toast */
.ss-toast-message {
  @apply fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg;
}
</style>
