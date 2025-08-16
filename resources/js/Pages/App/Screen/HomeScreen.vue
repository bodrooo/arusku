<script setup>
import BaseModal from '@/Components/BaseModal.vue';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  PieController,
  Tooltip,
} from 'chart.js';
import gsap from 'gsap';
import { nextTick, onMounted, ref } from 'vue';

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

// Dummy data akun keuangan (sama dengan BudgetScreen.vue)
const accounts = ref([
  { id: 1, name: 'Bank BRI', balance: 5000000, icon: 'ph-bank' },
  { id: 2, name: 'Tunai', balance: 1500000, icon: 'ph-wallet' },
  { id: 3, name: 'GoPay', balance: 300000, icon: 'ph-credit-card' },
]);

// Dummy data transaksi
const transactions = ref([
  {
    id: 1,
    name: 'Gaji Bulanan',
    amount: 5500000,
    type: 'income',
    icon: 'ph-wallet',
    account_id: 1,
  },
  {
    id: 2,
    name: 'Belanja Bulanan',
    amount: -1200000,
    type: 'expense',
    icon: 'ph-shopping-cart',
    account_id: 2,
  },
  {
    id: 3,
    name: 'Ngopi',
    amount: -25000,
    type: 'expense',
    icon: 'ph-coffee',
    account_id: 3,
  },
]);

// State untuk saldo, modal, toast, dan chart
const balance = ref(12500000);
const income = ref(5500000);
const expense = ref(3200000);
const showModal = ref(false);
const modalType = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const pieChartRef = ref(null);
const barChartRef = ref(null);
let pieChartInstance = null;
let barChartInstance = null;

// Form untuk tambah transaksi atau wallet
const form = ref({
  amount: null,
  description: '',
  account_id: null,
  name: '',
  balance: null,
});

// Fungsi untuk format tooltip chart
function formatTooltip(context) {
  return `Rp ${context.raw.toLocaleString()}`;
}

// Animasi masuk
onMounted(() => {
  nextTick(() => {
    gsap.from('.hs-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.hs-balance-card', {
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'back.out(1.7)',
    });
    gsap.from('.hs-quick-actions button', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out',
    });
    gsap.from('.hs-chart-section', {
      y: 20,
      opacity: 0,
      delay: 0.6,
      ease: 'power2.out',
    });
    gsap.from('.hs-transaction-title', {
      y: 20,
      opacity: 0,
      delay: 0.8,
      ease: 'power2.out',
    });
    gsap.from('.hs-transaction-item', {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      delay: 1.0,
      ease: 'power2.out',
    });
    // Animasi saldo dengan GSAP
    gsap.fromTo(
      '.hs-balance-text',
      { textContent: 0 },
      {
        textContent: balance.value,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate: function () {
          const el = this.targets()[0];
          el.textContent = `Rp ${Math.round(el.textContent).toLocaleString()}`;
        },
      },
    );
    // Inisialisasi chart
    initCharts();
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
function openModal(type, event) {
  modalType.value = type;
  form.value =
    type === 'add-wallet'
      ? { name: '', balance: null }
      : { amount: null, description: '', account_id: null };
  showModal.value = true;
  const btn = event.currentTarget;
  onClick(btn);
  gsap.fromTo(
    '.base-modal-content',
    { y: btn.getBoundingClientRect().top, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
  );
}

// Fungsi untuk submit form
function submitForm() {
  if (modalType.value === 'add-wallet') {
    if (!form.value.name || !form.value.balance) {
      toastMessage.value = 'Nama dan saldo harus diisi!';
      showToast.value = true;
      gsap.fromTo(
        '.hs-toast-message',
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
    accounts.value.push({
      id: accounts.value.length + 1,
      ...form.value,
      icon: 'ph-bank',
    });
    balance.value += form.value.balance;
    toastMessage.value = 'Wallet berhasil ditambahkan!';
    initCharts();
  } else {
    if (
      !form.value.amount ||
      !form.value.description ||
      !form.value.account_id
    ) {
      toastMessage.value = 'Semua field harus diisi!';
      showToast.value = true;
      gsap.fromTo(
        '.hs-toast-message',
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
    const newTransaction = {
      id: transactions.value.length + 1,
      name: form.value.description,
      amount:
        modalType.value === 'income' ? form.value.amount : -form.value.amount,
      type: modalType.value,
      icon: modalType.value === 'income' ? 'ph-wallet' : 'ph-shopping-cart',
      account_id: form.value.account_id,
    };
    transactions.value.unshift(newTransaction);
    if (modalType.value === 'income') {
      income.value += form.value.amount;
      balance.value += form.value.amount;
    } else {
      expense.value += form.value.amount;
      balance.value -= form.value.amount;
    }
    const account = accounts.value.find((a) => a.id === form.value.account_id);
    account.balance += newTransaction.amount;
    toastMessage.value = `Transaksi ${modalType.value} berhasil ditambahkan!`;
  }
  showModal.value = false;
  showToast.value = true;
  gsap.fromTo(
    '.hs-toast-message',
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

// Fungsi untuk inisialisasi chart
function initCharts() {
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }
  if (barChartInstance) {
    barChartInstance.destroy();
  }
  pieChartInstance = new Chart(pieChartRef.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [
        {
          data: [income.value, expense.value],
          backgroundColor: ['#22c55e', '#ef4444'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: formatTooltip,
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });
  barChartInstance = new Chart(barChartRef.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [
        {
          label: 'Pemasukan',
          data: [5000000, 5500000, 5300000, 6000000, 5800000, 6200000],
          backgroundColor: '#22c55e',
        },
        {
          label: 'Pengeluaran',
          data: [3000000, 3200000, 2800000, 3500000, 3000000, 3300000],
          backgroundColor: '#ef4444',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: formatTooltip,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `Rp ${value.toLocaleString()}`;
            },
          },
        },
      },
    },
  });
  gsap.from('.hs-chart-wrapper', {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.4,
    ease: 'power2.out',
  });
}
</script>

<template>
  <section class="hs-wrapper">
    <!-- Header -->
    <header class="hs-header">
      <h1 class="hs-header-title">Hi, Bodro 👋</h1>
      <p class="hs-header-subtitle">Selamat datang kembali</p>
    </header>

    <!-- Balance Card -->
    <div class="hs-balance-card">
      <p class="hs-balance-label">Saldo Saat Ini</p>
      <h2 class="hs-balance-text">Rp 0</h2>
      <div class="hs-balance-details">
        <span class="hs-income-text">+Rp {{ income.toLocaleString() }}</span>
        <span class="hs-expense-text">-Rp {{ expense.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="hs-quick-actions">
      <button
        @click="openModal('income', $event)"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        <i class="ph ph-arrow-circle-down hs-icon"></i>
        <span>Income</span>
      </button>
      <button
        @click="openModal('expense', $event)"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        <i class="ph ph-arrow-circle-up hs-icon"></i>
        <span>Expense</span>
      </button>
      <button
        @click="openModal('add-wallet', $event)"
        @mouseenter="onHoverEnter($event.currentTarget)"
        @mouseleave="onHoverLeave($event.currentTarget)"
      >
        <i class="ph ph-bank hs-icon"></i>
        <span>Wallet</span>
      </button>
    </div>

    <!-- Chart Section -->
    <div class="hs-chart-section">
      <h3 class="hs-chart-title">Laporan Keuangan</h3>
      <div class="hs-chart-wrapper">
        <canvas ref="pieChartRef"></canvas>
      </div>
      <div class="hs-chart-wrapper">
        <canvas ref="barChartRef"></canvas>
      </div>
    </div>

    <!-- Transaksi Terbaru -->
    <div>
      <h3 class="hs-transaction-title">Transaksi Terbaru</h3>
      <ul>
        <li
          v-for="trx in transactions"
          :key="trx.id"
          class="hs-transaction-item"
          @mouseenter="onHoverEnter($event.currentTarget)"
          @mouseleave="onHoverLeave($event.currentTarget)"
        >
          <div class="hs-transaction-content">
            <i :class="['ph', trx.icon, 'hs-transaction-icon']"></i>
            <div>
              <span class="hs-transaction-name">{{ trx.name }}</span>
              <p class="hs-transaction-account">
                {{ accounts.find((a) => a.id === trx.account_id)?.name }}
              </p>
            </div>
          </div>
          <span
            :class="
              trx.type === 'income' ? 'hs-income-text' : 'hs-expense-text'
            "
          >
            {{ trx.amount > 0 ? '+' : '' }}Rp
            {{ Math.abs(trx.amount).toLocaleString() }}
          </span>
        </li>
      </ul>
    </div>
  </section>

  <!-- Modal Tambah Transaksi atau Wallet -->
  <BaseModal v-model:show="showModal" position="center">
    <div class="base-modal-content">
      <h2 class="hs-modal-title">
        {{
          modalType === 'income'
            ? 'Tambah Pemasukan'
            : modalType === 'expense'
              ? 'Tambah Pengeluaran'
              : 'Tambah Wallet'
        }}
      </h2>
      <form @submit.prevent="submitForm" class="hs-form">
        <template v-if="modalType === 'income' || modalType === 'expense'">
          <div class="hs-form-group">
            <label class="hs-form-label">Jumlah</label>
            <input
              v-model="form.amount"
              type="number"
              placeholder="Masukkan jumlah"
              class="hs-form-input"
            />
          </div>
          <div class="hs-form-group">
            <label class="hs-form-label">Keterangan</label>
            <textarea
              v-model="form.description"
              placeholder="Masukkan keterangan"
              class="hs-form-textarea"
            ></textarea>
          </div>
          <div class="hs-form-group">
            <label class="hs-form-label">Akun</label>
            <select v-model="form.account_id" class="hs-form-select">
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
        <template v-else-if="modalType === 'add-wallet'">
          <div class="hs-form-group">
            <label class="hs-form-label">Nama Wallet</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Bank Mandiri"
              class="hs-form-input"
            />
          </div>
          <div class="hs-form-group">
            <label class="hs-form-label">Saldo Awal</label>
            <input
              v-model="form.balance"
              type="number"
              placeholder="Masukkan saldo"
              class="hs-form-input"
            />
          </div>
        </template>
        <button
          type="submit"
          class="hs-form-button"
          @click="onClick($event.currentTarget)"
        >
          Simpan
        </button>
      </form>
    </div>
  </BaseModal>

  <!-- Toast Notification -->
  <div v-if="showToast" class="hs-toast-message">
    {{ toastMessage }}
  </div>
</template>

<style>
/* Wrapper utama */
.hs-wrapper {
  @apply bg-background p-4;
}

/* Header */
.hs-header {
  @apply mb-4;
}

.hs-header-title {
  @apply text-xl font-bold text-text;
}

.hs-header-subtitle {
  @apply text-sm text-gray-500;
}

/* Kartu saldo */
.hs-balance-card {
  @apply mb-6 rounded-2xl bg-white p-4 shadow-card;
}

.hs-balance-label {
  @apply text-sm text-gray-500;
}

.hs-balance-text {
  @apply text-2xl font-bold text-primary;
}

.hs-balance-details {
  @apply mt-2 flex justify-between text-sm;
}

.hs-income-text {
  @apply text-green-600;
}

.hs-expense-text {
  @apply text-red-500;
}

/* Tombol aksi cepat */
.hs-quick-actions {
  @apply mb-6 grid grid-cols-3 gap-4;
}

.hs-quick-actions button {
  @apply flex flex-col items-center rounded-xl bg-white p-3 shadow-card;
}

.hs-icon {
  @apply text-2xl;
}

/* Seksi chart */
.hs-chart-section {
  @apply mb-6;
}

.hs-chart-title {
  @apply mb-2 text-sm font-medium text-gray-500;
}

.hs-chart-wrapper {
  @apply mx-auto max-w-sm rounded-xl bg-white p-4 shadow-card;
}

/* Transaksi */
.hs-transaction-title {
  @apply mb-2 mt-4 font-semibold text-text;
}

.hs-transaction-item {
  @apply mb-3 flex items-center justify-between rounded-xl bg-white p-3 shadow-card;
}

.hs-transaction-content {
  @apply flex items-center gap-3;
}

.hs-transaction-icon {
  @apply text-xl;
}

.hs-transaction-name {
  @apply font-medium;
}

.hs-transaction-account {
  @apply text-xs text-gray-500;
}

/* Modal */
.hs-modal-title {
  @apply mb-3 text-lg font-bold;
}

.hs-form {
  @apply p-4;
}

.hs-form-group {
  @apply mb-3;
}

.hs-form-label {
  @apply block text-sm font-medium;
}

.hs-form-input,
.hs-form-textarea,
.hs-form-select {
  @apply w-full rounded-lg border p-2;
}

.hs-form-button {
  @apply w-full rounded-lg bg-primary p-2 text-white;
}

/* Toast */
.hs-toast-message {
  @apply fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg;
}
</style>
