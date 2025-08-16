<script setup>
import BaseModal from '@/Components/BaseModal.vue';
import { ArcElement, Chart, Legend, PieController, Tooltip } from 'chart.js';
import gsap from 'gsap';
import { computed, onMounted, ref } from 'vue';

// Register Chart.js components untuk pie chart
Chart.register(PieController, ArcElement, Legend, Tooltip);

// Dummy data akun keuangan
const accounts = ref([
  { id: 1, name: 'Bank BRI', balance: 5000000, icon: 'ph-bank' },
  { id: 2, name: 'Tunai', balance: 1500000, icon: 'ph-wallet' },
  { id: 3, name: 'GoPay', balance: 300000, icon: 'ph-credit-card' },
]);

// Dummy data budget
const budgets = ref([
  {
    id: 1,
    category: 'Belanja',
    amount: 2000000,
    spent: 1200000,
    period: 'Bulanan',
    account_id: 1, // Terkait dengan Bank BRI
    icon: 'ph-shopping-cart',
  },
  {
    id: 2,
    category: 'Hiburan',
    amount: 500000,
    spent: 300000,
    period: 'Bulanan',
    account_id: 2, // Terkait dengan Tunai
    icon: 'ph-film-strip',
  },
  {
    id: 3,
    category: 'Transportasi',
    amount: 1000000,
    spent: 800000,
    period: 'Mingguan',
    account_id: 3, // Terkait dengan GoPay
    icon: 'ph-car',
  },
]);

// State untuk filter, modal, toast, dan chart
const selectedAccount = ref('Semua');
const selectedPeriod = ref('Semua');
const showModal = ref(false);
const modalType = ref('add');
const modalData = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const pieChartRef = ref(null);
let pieChartInstance = null;

// Form untuk tambah/edit budget atau akun
const form = ref({
  category: '',
  amount: null,
  period: 'Bulanan',
  account_id: null,
  name: '', // Untuk tambah akun
  balance: null, // Untuk tambah akun
});

// Animasi masuk dan inisialisasi chart
onMounted(() => {
  gsap.from('.bs-header', {
    y: -20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  });
  gsap.from('.bs-account-card', {
    scale: 0.95,
    opacity: 0,
    stagger: 0.1,
    delay: 0.2,
    ease: 'back.out(1.7)',
  });
  gsap.from('.bs-chart', {
    y: 20,
    opacity: 0,
    delay: 0.3,
    ease: 'power2.out',
  });
  gsap.from('.bs-filter', {
    y: -20,
    opacity: 0,
    delay: 0.4,
    ease: 'power2.out',
  });
  gsap.from('.bs-card', {
    scale: 0.95,
    opacity: 0,
    stagger: 0.1,
    delay: 0.5,
    ease: 'back.out(1.7)',
  });
  gsap.from('.bs-add-btn, .bs-add-account-btn', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    delay: 0.6,
    ease: 'power2.out',
  });

  // Inisialisasi pie chart
  initChart();
});

// Fungsi untuk inisialisasi pie chart
function initChart() {
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }
  pieChartInstance = new Chart(pieChartRef.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels: accounts.value.map((acc) => acc.name),
      datasets: [
        {
          data: accounts.value.map((acc) => acc.balance),
          backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => `Rp ${context.raw.toLocaleString()}`,
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });
  gsap.from(pieChartRef.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)',
  });
}

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
function openModal(type, event, data = null) {
  modalType.value = type;
  modalData.value = data;
  if (type === 'add' || type === 'edit') {
    form.value = data
      ? { ...data }
      : { category: '', amount: null, period: 'Bulanan', account_id: null };
  } else if (type === 'add-account') {
    form.value = { name: '', balance: null };
  }
  showModal.value = true;
  const btn = event.currentTarget;
  onClick(btn); // Animasi klik
  gsap.fromTo(
    '.bs-modal-content',
    { y: btn.getBoundingClientRect().top, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
  );
}

// Fungsi untuk submit form (dummy)
function submitForm() {
  if (
    modalType.value === 'add-account' &&
    (!form.value.name || !form.value.balance)
  ) {
    toastMessage.value = 'Nama dan saldo harus diisi!';
    showToast.value = true;
    gsap.fromTo(
      '.bs-toast-message',
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
  if (modalType.value === 'add') {
    budgets.value.push({
      id: budgets.value.length + 1,
      ...form.value,
      spent: 0,
      icon: 'ph-wallet', // Default icon
    });
    toastMessage.value = 'Budget berhasil ditambahkan!';
  } else if (modalType.value === 'edit') {
    const index = budgets.value.findIndex((b) => b.id === modalData.value.id);
    budgets.value[index] = {
      ...form.value,
      id: modalData.value.id,
      spent: budgets.value[index].spent,
    };
    toastMessage.value = 'Budget berhasil diubah!';
  } else if (modalType.value === 'add-account') {
    accounts.value.push({
      id: accounts.value.length + 1,
      ...form.value,
      icon: 'ph-bank', // Default icon
    });
    toastMessage.value = 'Akun berhasil ditambahkan!';
    initChart(); // Update chart setelah tambah akun
  }
  showModal.value = false;
  showToast.value = true;
  gsap.fromTo(
    '.bs-toast-message',
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

// Fungsi untuk hapus budget
function deleteBudget(id, event) {
  const btn = event.currentTarget;
  onClick(btn); // Animasi klik
  gsap.to(btn, {
    scale: 0.9,
    duration: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      budgets.value = budgets.value.filter((b) => b.id !== id);
      toastMessage.value = 'Budget dihapus!';
      showToast.value = true;
      gsap.fromTo(
        '.bs-toast-message',
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
    },
  });
}

// Hitung persentase progress
function getProgressPercentage(budget) {
  return Math.min((budget.spent / budget.amount) * 100, 100);
}

// Filter budget berdasarkan akun dan periode
const filteredBudgets = computed(() => {
  let result = budgets.value;
  if (selectedAccount.value !== 'Semua') {
    result = result.filter(
      (b) => b.account_id === parseInt(selectedAccount.value),
    );
  }
  if (selectedPeriod.value !== 'Semua') {
    result = result.filter((b) => b.period === selectedPeriod.value);
  }
  return result;
});

// Hitung total saldo semua akun
const totalBalance = computed(() => {
  return accounts.value.reduce((sum, acc) => sum + acc.balance, 0);
});
</script>

<template>
  <section class="bs-wrapper">
    <!-- Header -->
    <header class="bs-header">
      <h1 class="bs-header-title">Budget Keuangan</h1>
      <p class="bs-header-subtitle">
        Total Saldo: Rp {{ totalBalance.toLocaleString() }}
      </p>
    </header>

    <!-- Pie Chart Distribusi Akun -->
    <div class="bs-chart">
      <h3 class="bs-chart-title">Distribusi Saldo</h3>
      <canvas ref="pieChartRef"></canvas>
    </div>

    <!-- Daftar Akun -->
    <div class="bs-account-list">
      <div class="bs-account-container">
        <button
          v-for="account in accounts"
          :key="account.id"
          class="bs-account-card"
          :class="{
            'bs-account-selected': selectedAccount === account.id.toString(),
          }"
          @click="selectedAccount = account.id.toString()"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
        >
          <i :class="['ph', account.icon, 'bs-icon']"></i>
          <div>
            <h3 class="bs-account-name">{{ account.name }}</h3>
            <p class="bs-account-balance">
              Rp {{ account.balance.toLocaleString() }}
            </p>
          </div>
        </button>
        <button
          class="bs-account-card"
          :class="{ 'bs-account-selected': selectedAccount === 'Semua' }"
          @click="selectedAccount = 'Semua'"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
        >
          <i class="ph ph-wallet bs-icon"></i>
          <div>
            <h3 class="bs-account-name">Semua</h3>
            <p class="bs-account-balance">
              Rp {{ totalBalance.toLocaleString() }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Filter Periode -->
    <div class="bs-filter">
      <select v-model="selectedPeriod" class="bs-filter-select">
        <option value="Semua">Semua Periode</option>
        <option value="Bulanan">Bulanan</option>
        <option value="Mingguan">Mingguan</option>
        <option value="Harian">Harian</option>
      </select>
    </div>

    <!-- Daftar Budget -->
    <div class="bs-list">
      <div
        v-for="budget in filteredBudgets"
        :key="budget.id"
        class="bs-card"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        <div class="bs-card-header">
          <div class="bs-card-info">
            <i :class="['ph', budget.icon, 'bs-icon']"></i>
            <div>
              <h3 class="bs-card-title">{{ budget.category }}</h3>
              <p class="bs-card-subtitle">
                {{ budget.period }} •
                {{ accounts.find((a) => a.id === budget.account_id)?.name }}
              </p>
            </div>
          </div>
          <div class="bs-card-actions">
            <button
              class="bs-action-button bs-edit-button"
              @click="openModal('edit', $event, budget)"
            >
              <i class="ph ph-pencil-simple bs-action-icon"></i>
            </button>
            <button
              class="bs-action-button bs-delete-button"
              @click="deleteBudget(budget.id, $event)"
            >
              <i class="ph ph-trash bs-action-icon"></i>
            </button>
          </div>
        </div>
        <div class="bs-card-progress">
          <p class="bs-progress-text">
            Rp {{ budget.spent.toLocaleString() }} /
            {{ budget.amount.toLocaleString() }}
          </p>
          <div class="bs-progress-bar">
            <div
              class="bs-progress-fill"
              :class="{
                'bg-green-500': getProgressPercentage(budget) < 70,
                'bg-yellow-500':
                  getProgressPercentage(budget) >= 70 &&
                  getProgressPercentage(budget) < 90,
                'bg-red-500': getProgressPercentage(budget) >= 90,
              }"
              :style="{ width: `${getProgressPercentage(budget)}%` }"
            ></div>
          </div>
          <p class="bs-progress-percentage">
            {{ getProgressPercentage(budget).toFixed(1) }}% terpakai
          </p>
        </div>
      </div>
      <p v-if="!filteredBudgets.length" class="bs-no-budget">
        Tidak ada budget untuk akun atau periode ini.
      </p>
    </div>

    <!-- Tombol Tambah Budget -->
    <button
      class="bs-add-btn"
      @click="openModal('add', $event)"
      @mouseenter="onHoverEnter($event.currentTarget)"
      @mouseleave="onHoverLeave($event.currentTarget)"
    >
      <i class="ph ph-bold ph-plus bs-add-icon"></i>
    </button>

    <!-- Tombol Tambah Akun -->
    <button
      class="bs-add-account-btn"
      @click="openModal('add-account', $event)"
      @mouseenter="onHoverEnter($event.currentTarget)"
      @mouseleave="onHoverLeave($event.currentTarget)"
    >
      <i class="ph ph-bank bs-add-icon"></i>
    </button>

    <!-- Modal Tambah/Edit Budget atau Akun -->
    <BaseModal v-model:show="showModal" position="center">
      <div class="bs-modal-content">
        <h2 class="bs-modal-title">
          {{
            modalType === 'add'
              ? 'Tambah Budget'
              : modalType === 'edit'
                ? 'Edit Budget'
                : 'Tambah Akun'
          }}
        </h2>
        <form @submit.prevent="submitForm" class="bs-form">
          <template v-if="modalType === 'add' || modalType === 'edit'">
            <div class="bs-form-group">
              <label class="bs-form-label">Kategori</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="Contoh: Belanja"
                class="bs-form-input"
              />
            </div>
            <div class="bs-form-group">
              <label class="bs-form-label">Jumlah</label>
              <input
                v-model="form.amount"
                type="number"
                placeholder="Masukkan jumlah"
                class="bs-form-input"
              />
            </div>
            <div class="bs-form-group">
              <label class="bs-form-label">Periode</label>
              <select v-model="form.period" class="bs-form-select">
                <option value="Bulanan">Bulanan</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Harian">Harian</option>
              </select>
            </div>
            <div class="bs-form-group">
              <label class="bs-form-label">Akun</label>
              <select v-model="form.account_id" class="bs-form-select">
                <option :value="null" disabled>Pilih akun</option>
                <option
                  v-for="account in accounts"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.name }}
                </option>
              </select>
            </div>
          </template>
          <template v-else-if="modalType === 'add-account'">
            <div class="bs-form-group">
              <label class="bs-form-label">Nama Akun</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Bank Mandiri"
                class="bs-form-input"
              />
            </div>
            <div class="bs-form-group">
              <label class="bs-form-label">Saldo Awal</label>
              <input
                v-model="form.balance"
                type="number"
                placeholder="Masukkan saldo"
                class="bs-form-input"
              />
            </div>
          </template>
          <button
            type="submit"
            class="bs-form-button"
            @click="onClick($event.currentTarget)"
          >
            Simpan
          </button>
        </form>
      </div>
    </BaseModal>

    <!-- Toast Notification -->
    <div v-if="showToast" class="bs-toast-message">
      {{ toastMessage }}
    </div>
  </section>
</template>

<style>
/* Wrapper utama */
.bs-wrapper {
  @apply bg-background p-4;
}

/* Header */
.bs-header {
  @apply mb-4;
}

.bs-header-title {
  @apply text-xl font-bold text-text;
}

.bs-header-subtitle {
  @apply text-sm text-gray-500;
}

/* Chart distribusi saldo */
.bs-chart {
  @apply mx-auto mb-6 max-w-sm rounded-xl bg-white p-4 shadow-card;
}

.bs-chart-title {
  @apply mb-2 text-sm font-medium text-gray-500;
}

/* Daftar akun */
.bs-account-list {
  @apply mb-4;
}

.bs-account-container {
  @apply flex gap-3 overflow-x-auto pb-2;
}

.bs-account-card {
  @apply flex flex-shrink-0 items-center gap-3 rounded-xl bg-white p-3 shadow-card;
}

.bs-account-selected {
  @apply bg-primary text-white;
}

.bs-account-name {
  @apply font-medium;
}

.bs-account-balance {
  @apply text-sm;
}

.bs-icon {
  @apply text-xl;
}

/* Filter periode */
.bs-filter {
  @apply mb-4;
}

.bs-filter-select {
  @apply w-full rounded-lg border p-2 text-sm;
}

/* Daftar budget */
.bs-list {
  @apply mb-6;
}

.bs-card {
  @apply mb-3 rounded-xl bg-white p-3 shadow-card;
}

.bs-card-header {
  @apply flex items-center justify-between;
}

.bs-card-info {
  @apply flex items-center gap-3;
}

.bs-card-title {
  @apply font-medium;
}

.bs-card-subtitle {
  @apply text-sm text-gray-500;
}

.bs-card-actions {
  @apply flex items-center gap-2;
}

.bs-action-button {
  @apply text-gray-500;
}

.bs-action-icon {
  @apply text-lg;
}

.bs-edit-button:hover {
  @apply text-primary;
}

.bs-delete-button:hover {
  @apply text-red-500;
}

.bs-progress-bar {
  @apply h-2 w-full rounded-full bg-gray-200;
}

.bs-progress-fill {
  @apply h-full rounded-full;
}

.bs-progress-text {
  @apply text-sm font-medium;
}

.bs-progress-percentage {
  @apply mt-1 text-xs text-gray-500;
}

.bs-no-budget {
  @apply text-center text-gray-500;
}

/* Tombol tambah */
.bs-add-btn {
  @apply fixed bottom-24 right-4 rounded-full bg-primary p-3 text-white shadow-lg;
}

.bs-add-account-btn {
  @apply fixed bottom-24 right-18 rounded-full bg-gray-500 p-3 text-white shadow-lg;
}

.bs-add-icon {
  @apply text-2xl;
}

/* Modal */
.bs-modal-content {
  @apply p-4;
}

.bs-modal-title {
  @apply mb-3 text-lg font-bold;
}

.bs-form {
  @apply space-y-3;
}

.bs-form-group {
  @apply mb-3;
}

.bs-form-label {
  @apply block text-sm font-medium;
}

.bs-form-input,
.bs-form-select {
  @apply w-full rounded-lg border p-2;
}

.bs-form-button {
  @apply w-full rounded-lg bg-primary p-2 text-white;
}

/* Toast */
.bs-toast-message {
  @apply fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg;
}
</style>
