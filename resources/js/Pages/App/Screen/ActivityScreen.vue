<script setup>
import BaseModal from '@/Components/BaseModal.vue';
import DatePicker from '@/Components/DatePicker.vue';
import gsap from 'gsap';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

// Dummy data transaksi
const transactionsData = ref([
  {
    id: 1,
    name: 'Gaji Bulanan',
    amount: 5500000,
    type: 'income',
    icon: 'ph-wallet',
    date: '2025-08-01',
    category: 'Gaji',
    description: 'Gaji bulan Agustus',
  },
  {
    id: 2,
    name: 'Belanja Bulanan',
    amount: -1200000,
    type: 'expense',
    icon: 'ph-shopping-cart',
    date: '2025-08-02',
    category: 'Belanja',
    description: 'Belanja kebutuhan rumah',
  },
  {
    id: 3,
    name: 'Ngopi',
    amount: -25000,
    type: 'expense',
    icon: 'ph-coffee',
    date: '2025-08-03',
    category: 'Makanan',
    description: 'Kopi di kafe',
  },
  {
    id: 4,
    name: 'Freelance',
    amount: 2000000,
    type: 'income',
    icon: 'ph-briefcase',
    date: '2025-08-04',
    category: 'Pekerjaan',
    description: 'Proyek freelance',
  },
  {
    id: 5,
    name: 'Beli Baju',
    amount: -300000,
    type: 'expense',
    icon: 'ph-t-shirt',
    date: '2025-08-05',
    category: 'Belanja',
    description: 'Baju baru',
  },
  {
    id: 6,
    name: 'Bonus Proyek',
    amount: 1000000,
    type: 'income',
    icon: 'ph-briefcase',
    date: '2025-08-06',
    category: 'Pekerjaan',
    description: 'Bonus proyek sampingan',
  },
]);

// State untuk filter, pencarian, sort, dan infinite scroll
const searchQuery = ref('');
const filterType = ref('all'); // all, income, expense
const dateFilter = ref('all'); // all, today, yesterday, 7days, 30days, custom
const dateRange = ref({ start: null, end: null }); // Untuk rentang kustom
const filterCategory = ref('all'); // all atau kategori tertentu
const sortOption = ref('latest'); // latest, oldest, highest, lowest
const showDetailModal = ref(false);
const showFilterModal = ref(false);
const showDateFilterModal = ref(false);
const showCategoryModal = ref(false);
const showSortModal = ref(false);
const showDatePickerModal = ref(false);
const selectedTransaction = ref(null);
const page = ref(1);
const pageSize = 4; // Jumlah transaksi per halaman
const isLoading = ref(false);
let observer = null;

// Opsi untuk filter tipe
const filterOptions = [
  { value: 'all', label: 'Semua', icon: 'ph-list' },
  { value: 'income', label: 'Pemasukan', icon: 'ph-arrow-circle-down' },
  { value: 'expense', label: 'Pengeluaran', icon: 'ph-arrow-circle-up' },
];

// Opsi untuk filter tanggal
const dateFilterOptions = [
  { value: 'all', label: 'Semua Waktu', icon: 'ph-calendar' },
  { value: 'today', label: 'Hari Ini', icon: 'ph-calendar-check' },
  { value: 'yesterday', label: 'Kemarin', icon: 'ph-calendar-minus' },
  { value: '7days', label: '7 Hari Terakhir', icon: 'ph-calendar-blank' },
  { value: '30days', label: '30 Hari Terakhir', icon: 'ph-calendar-blank' },
  { value: 'custom', label: 'Pilih Rentang', icon: 'ph-calendar-plus' },
];

// Opsi untuk filter kategori (dari data transaksi)
const categoryOptions = computed(() => {
  const categories = [
    ...new Set(transactionsData.value.map((trx) => trx.category)),
  ];
  return [
    { value: 'all', label: 'Semua Kategori', icon: 'ph-tag' },
    ...categories.map((category) => ({
      value: category,
      label: category,
      icon: 'ph-tag',
    })),
  ];
});

// Opsi untuk sort
const sortOptions = [
  { value: 'latest', label: 'Terbaru', icon: 'ph-sort-descending' },
  { value: 'oldest', label: 'Terlama', icon: 'ph-sort-ascending' },
  { value: 'highest', label: 'Jumlah Terbesar', icon: 'ph-arrow-fat-up' },
  { value: 'lowest', label: 'Jumlah Terkecil', icon: 'ph-arrow-fat-down' },
];

// Cek apakah ada filter aktif
const isFilterActive = computed(() => {
  return (
    filterType.value !== 'all' ||
    filterCategory.value !== 'all' ||
    dateFilter.value !== 'all' ||
    dateRange.value.start !== null ||
    dateRange.value.end !== null ||
    sortOption.value !== 'latest' ||
    searchQuery.value !== ''
  );
});

// Format rentang tanggal untuk tampilan
const formattedDateRange = computed(() => {
  if (
    dateFilter.value !== 'custom' ||
    !dateRange.value.start ||
    !dateRange.value.end
  ) {
    return (
      dateFilterOptions.find((opt) => opt.value === dateFilter.value)?.label ||
      'Pilih Periode'
    );
  }
  const start = new Date(dateRange.value.start);
  const end = new Date(dateRange.value.end);
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `${formatDate(start)} - ${formatDate(end)}`;
});

// Computed property untuk filter, sort, dan paginasi
const filteredTransactions = computed(() => {
  let filtered = transactionsData.value;

  // Filter berdasarkan tipe
  if (filterType.value !== 'all') {
    filtered = filtered.filter((trx) => trx.type === filterType.value);
  }

  // Filter berdasarkan kategori
  if (filterCategory.value !== 'all') {
    filtered = filtered.filter((trx) => trx.category === filterCategory.value);
  }

  // Filter berdasarkan pencarian nama
  if (searchQuery.value) {
    filtered = filtered.filter((trx) =>
      trx.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  // Filter berdasarkan tanggal
  if (dateFilter.value !== 'all') {
    const today = new Date('2025-08-15'); // Sesuaikan dengan tanggal saat ini
    filtered = filtered.filter((trx) => {
      const trxDate = new Date(trx.date);
      if (dateFilter.value === 'today') {
        return trxDate.toDateString() === today.toDateString();
      } else if (dateFilter.value === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return trxDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter.value === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return trxDate >= sevenDaysAgo && trxDate <= today;
      } else if (dateFilter.value === '30days') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return trxDate >= thirtyDaysAgo && trxDate <= today;
      } else if (
        dateFilter.value === 'custom' &&
        dateRange.value.start &&
        dateRange.value.end
      ) {
        const startDate = new Date(dateRange.value.start);
        const endDate = new Date(dateRange.value.end);
        return trxDate >= startDate && trxDate <= endDate;
      }
      return true;
    });
  }

  // Sort berdasarkan opsi
  filtered = [...filtered];
  if (sortOption.value === 'latest') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortOption.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOption.value === 'highest') {
    filtered.sort((a, b) => b.amount - a.amount);
  } else if (sortOption.value === 'lowest') {
    filtered.sort((a, b) => a.amount - b.amount);
  }

  // Paginasi untuk infinite scroll
  return filtered.slice(0, page.value * pageSize);
});

// Reset semua filter
function resetFilters() {
  searchQuery.value = '';
  filterType.value = 'all';
  filterCategory.value = 'all';
  dateFilter.value = 'all';
  dateRange.value = { start: null, end: null };
  sortOption.value = 'latest';
  page.value = 1;
  nextTick(() => {
    gsap.from('.as-filter', {
      y: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
}

// Buka modal detail transaksi
function openDetailModal(transaction) {
  selectedTransaction.value = transaction;
  showDetailModal.value = true;
  nextTick(() => {
    gsap.from('.as-detail-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// Buka modal filter tipe
function openFilterModal() {
  showFilterModal.value = true;
  nextTick(() => {
    gsap.from('.as-filter-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// Buka modal filter tanggal
function openDateFilterModal() {
  showDateFilterModal.value = true;
  nextTick(() => {
    gsap.from('.as-date-filter-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// Buka modal filter kategori
function openCategoryModal() {
  showCategoryModal.value = true;
  nextTick(() => {
    gsap.from('.as-category-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// Buka modal sort
function openSortModal() {
  showSortModal.value = true;
  nextTick(() => {
    gsap.from('.as-sort-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// Pilih filter tipe
function selectFilter(value) {
  filterType.value = value;
  showFilterModal.value = false;
}

// Pilih filter tanggal
async function selectDateFilter(value) {
  dateFilter.value = value;
  if (value !== 'custom') {
    dateRange.value = { start: null, end: null };
    await nextTick();
    showDateFilterModal.value = false;
  } else {
    showDatePickerModal.value = true;
    showDateFilterModal.value = false;
  }
}

// Pilih filter kategori
function selectCategory(value) {
  filterCategory.value = value;
  showCategoryModal.value = false;
}

// Pilih opsi sort
function selectSort(value) {
  sortOption.value = value;
  showSortModal.value = false;
}

// Update rentang tanggal kustom
function updateCustomDateRange(range) {
  dateFilter.value = 'custom';
  dateRange.value = range;
  showDatePickerModal.value = false;
}

// Infinite scroll
function loadMore(entries) {
  if (entries[0].isIntersecting && !isLoading.value) {
    isLoading.value = true;
    setTimeout(() => {
      page.value++;
      isLoading.value = false;
    }, 500); // Simulasi delay, ganti dengan API call jika diperlukan
  }
}

// Setup IntersectionObserver
onMounted(() => {
  nextTick(() => {
    gsap.from('.as-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.as-filter', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.out',
    });
    gsap.from('.as-transaction-item', {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      delay: 0.4,
      ease: 'power2.out',
    });

    // Setup IntersectionObserver untuk infinite scroll
    const sentinel = document.querySelector('#sentinel');
    if (sentinel) {
      observer = new IntersectionObserver(loadMore, { threshold: 0.1 });
      observer.observe(sentinel);
    }
  });
});

// Cleanup observer saat component unmounted
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <section class="as-wrapper">
    <!-- Header -->
    <header class="as-header">
      <h1 class="as-header-title">Riwayat Transaksi</h1>
      <p class="as-header-subtitle">Lihat semua pemasukan & pengeluaran</p>
    </header>

    <!-- Filter, Pencarian, Sort, dan Reset -->
    <div class="as-filter">
      <!-- Pencarian -->
      <div class="as-search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari transaksi..."
          class="as-search-input"
        />
        <i class="as-search-icon ph ph-magnifying-glass"></i>
      </div>
      <!-- Filter tipe untuk mobile -->
      <button class="as-filter-button md:hidden" @click="openFilterModal">
        <i
          :class="[
            'ph',
            filterOptions.find((opt) => opt.value === filterType)?.icon,
            'as-icon',
          ]"
        ></i>
        {{ filterOptions.find((opt) => opt.value === filterType)?.label }}
      </button>
      <!-- Filter tipe untuk desktop -->
      <select v-model="filterType" class="as-filter-select hidden md:block">
        <option
          v-for="opt in filterOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <!-- Filter kategori untuk mobile -->
      <button class="as-filter-button md:hidden" @click="openCategoryModal">
        <i
          :class="[
            'ph',
            categoryOptions.find((opt) => opt.value === filterCategory)?.icon,
            'as-icon',
          ]"
        ></i>
        {{ categoryOptions.find((opt) => opt.value === filterCategory)?.label }}
      </button>
      <!-- Filter kategori untuk desktop -->
      <select v-model="filterCategory" class="as-filter-select hidden md:block">
        <option
          v-for="opt in categoryOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <!-- Filter tanggal untuk mobile -->
      <button class="as-filter-button md:hidden" @click="openDateFilterModal">
        <i
          :class="[
            'ph',
            dateFilterOptions.find((opt) => opt.value === dateFilter)?.icon,
            'as-icon',
          ]"
        ></i>
        {{ formattedDateRange }}
      </button>
      <!-- Filter tanggal untuk desktop -->
      <div class="as-date-input-container hidden md:flex">
        <input
          v-model="dateRange.start"
          type="date"
          class="as-date-input"
          @change="
            dateFilter = 'custom';
            updateCustomDateRange(dateRange);
          "
        />
        <input
          v-model="dateRange.end"
          type="date"
          class="as-date-input"
          @change="
            dateFilter = 'custom';
            updateCustomDateRange(dateRange);
          "
        />
      </div>
      <!-- Sort untuk mobile -->
      <button class="as-filter-button md:hidden" @click="openSortModal">
        <i
          :class="[
            'ph',
            sortOptions.find((opt) => opt.value === sortOption)?.icon,
            'as-icon',
          ]"
        ></i>
        {{ sortOptions.find((opt) => opt.value === sortOption)?.label }}
      </button>
      <!-- Sort untuk desktop -->
      <select v-model="sortOption" class="as-filter-select hidden md:block">
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <!-- Tombol Reset -->
      <button
        v-if="isFilterActive"
        class="as-reset-button"
        @click="resetFilters"
      >
        <i class="ph ph-x-circle as-icon"></i>
        Reset
      </button>
    </div>

    <!-- Daftar Transaksi -->
    <ul>
      <li
        v-for="trx in filteredTransactions"
        :key="trx.id"
        class="as-transaction-item"
        @click="openDetailModal(trx)"
      >
        <div class="as-transaction-content">
          <i :class="['ph', trx.icon, 'as-transaction-icon']"></i>
          <div>
            <span class="as-transaction-name">{{ trx.name }}</span>
            <p class="as-transaction-date">{{ trx.date }}</p>
          </div>
        </div>
        <span
          :class="trx.type === 'income' ? 'as-income-text' : 'as-expense-text'"
        >
          {{ trx.amount > 0 ? '+' : '' }}Rp
          {{ Math.abs(trx.amount).toLocaleString() }}
        </span>
      </li>
      <li v-if="!filteredTransactions.length" class="as-no-transaction">
        <i class="ph ph-file-x as-no-transaction-icon"></i>
        <p>Tidak ada transaksi ditemukan</p>
      </li>
      <li v-if="isLoading" class="as-loading">
        <i class="ph ph-spinner as-loading-icon animate-spin"></i>
      </li>
      <li id="sentinel" class="as-sentinel"></li>
    </ul>

    <!-- Modal Detail Transaksi -->
    <BaseModal v-model:show="showDetailModal" position="center">
      <div class="as-detail-modal-content">
        <h2 class="as-modal-title">Detail Transaksi</h2>
        <div v-if="selectedTransaction" class="as-detail-content">
          <p>
            <strong class="as-detail-label">Nama:</strong>
            {{ selectedTransaction.name }}
          </p>
          <p>
            <strong class="as-detail-label">Jumlah:</strong>
            <span
              :class="
                selectedTransaction.type === 'income'
                  ? 'as-income-text'
                  : 'as-expense-text'
              "
            >
              {{ selectedTransaction.amount > 0 ? '+' : '' }}Rp
              {{ Math.abs(selectedTransaction.amount).toLocaleString() }}
            </span>
          </p>
          <p>
            <strong class="as-detail-label">Tanggal:</strong>
            {{ selectedTransaction.date }}
          </p>
          <p>
            <strong class="as-detail-label">Kategori:</strong>
            {{ selectedTransaction.category || '-' }}
          </p>
          <p>
            <strong class="as-detail-label">Keterangan:</strong>
            {{ selectedTransaction.description || '-' }}
          </p>
          <button class="as-modal-button" @click="showDetailModal = false">
            Tutup
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal Filter Tipe untuk Mobile -->
    <BaseModal v-model:show="showFilterModal" position="center">
      <div class="as-filter-modal-content">
        <h2 class="as-modal-title">Pilih Filter</h2>
        <ul class="as-modal-list">
          <li
            v-for="opt in filterOptions"
            :key="opt.value"
            class="as-modal-item"
            @click="selectFilter(opt.value)"
          >
            <i :class="['ph', opt.icon, 'as-icon']"></i>
            <span>{{ opt.label }}</span>
          </li>
        </ul>
      </div>
    </BaseModal>

    <!-- Modal Filter Kategori untuk Mobile -->
    <BaseModal v-model:show="showCategoryModal" position="center">
      <div class="as-category-modal-content">
        <h2 class="as-modal-title">Pilih Kategori</h2>
        <ul class="as-modal-list">
          <li
            v-for="opt in categoryOptions"
            :key="opt.value"
            class="as-modal-item"
            @click="selectCategory(opt.value)"
          >
            <i :class="['ph', opt.icon, 'as-icon']"></i>
            <span>{{ opt.label }}</span>
          </li>
        </ul>
      </div>
    </BaseModal>

    <!-- Modal Filter Tanggal untuk Mobile -->
    <BaseModal v-model:show="showDateFilterModal" position="center">
      <div class="as-date-filter-modal-content">
        <h2 class="as-modal-title">Pilih Periode</h2>
        <ul class="as-modal-list">
          <li
            v-for="opt in dateFilterOptions"
            :key="opt.value"
            class="as-modal-item"
            @click="selectDateFilter(opt.value)"
          >
            <i :class="['ph', opt.icon, 'as-icon']"></i>
            <span>{{ opt.label }}</span>
          </li>
        </ul>
      </div>
    </BaseModal>

    <!-- Modal Sort untuk Mobile -->
    <BaseModal v-model:show="showSortModal" position="center">
      <div class="as-sort-modal-content">
        <h2 class="as-modal-title">Urutkan Berdasarkan</h2>
        <ul class="as-modal-list">
          <li
            v-for="opt in sortOptions"
            :key="opt.value"
            class="as-modal-item"
            @click="selectSort(opt.value)"
          >
            <i :class="['ph', opt.icon, 'as-icon']"></i>
            <span>{{ opt.label }}</span>
          </li>
        </ul>
      </div>
    </BaseModal>

    <!-- Modal DatePicker untuk Rentang Kustom -->
    <DatePicker
      v-model="dateRange"
      :show="showDatePickerModal"
      mode="range"
      @update:modelValue="updateCustomDateRange"
      @update:show="showDatePickerModal = false"
    />
  </section>
</template>

<style>
/* Wrapper utama */
.as-wrapper {
  @apply bg-background p-4;
}

/* Header */
.as-header {
  @apply mb-4;
}

.as-header-title {
  @apply text-xl font-bold text-text;
}

.as-header-subtitle {
  @apply text-sm text-gray-500;
}

/* Filter dan pencarian */
.as-filter {
  @apply mb-6 flex flex-wrap gap-3;
}

.as-search-container {
  @apply relative w-full md:w-1/3;
}

.as-search-input {
  @apply w-full rounded-xl border border-gray-300 p-3 pr-10 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary;
}

.as-search-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400;
}

.as-filter-button {
  @apply flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm hover:bg-gray-50 active:scale-95;
}

.as-filter-select {
  @apply rounded-xl border border-gray-300 p-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary;
}

.as-date-input-container {
  @apply gap-3;
}

.as-date-input {
  @apply rounded-xl border border-gray-300 p-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary;
}

.as-reset-button {
  @apply flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm hover:bg-gray-50 active:scale-95;
}

.as-icon {
  @apply text-lg;
}

/* Transaksi */
.as-transaction-item {
  @apply mb-3 flex cursor-pointer items-center justify-between rounded-xl bg-white p-3 shadow-card;
}

.as-transaction-content {
  @apply flex items-center gap-3;
}

.as-transaction-icon {
  @apply text-xl;
}

.as-transaction-name {
  @apply font-medium text-text;
}

.as-transaction-date {
  @apply text-xs text-gray-500;
}

.as-income-text {
  @apply text-green-600;
}

.as-expense-text {
  @apply text-red-500;
}

.as-no-transaction {
  @apply flex flex-col items-center gap-2 py-6 text-center text-gray-500;
}

.as-no-transaction-icon {
  @apply text-4xl;
}

.as-loading {
  @apply flex justify-center py-4;
}

.as-loading-icon {
  @apply text-2xl text-primary;
}

.as-sentinel {
  @apply h-1;
}

/* Modal */
.as-detail-modal-content,
.as-filter-modal-content,
.as-category-modal-content,
.as-date-filter-modal-content,
.as-sort-modal-content {
  @apply relative z-10 mx-auto w-11/12 max-w-sm rounded-2xl bg-white p-4 shadow-card;
}

.as-modal-title {
  @apply mb-4 text-lg font-bold text-text;
}

.as-detail-content {
  @apply space-y-3;
}

.as-detail-label {
  @apply text-text;
}

.as-modal-button {
  @apply mt-4 w-full rounded-xl bg-primary p-3 text-white shadow-sm hover:bg-primary/90 active:scale-95;
}

.as-modal-list {
  @apply space-y-2;
}

.as-modal-item {
  @apply flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 active:scale-95;
}
</style>
