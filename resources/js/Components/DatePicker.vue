<script setup>
import BaseModal from '@/Components/BaseModal.vue';
import { gsap } from 'gsap';
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Object], // String untuk single date, Object untuk range { start, end }
  show: Boolean,
  mode: {
    type: String,
    default: 'single', // 'single' atau 'range'
  },
});

const emit = defineEmits(['update:modelValue', 'update:show']);

const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthDays = ref([]);
const startDay = ref(0);
const selectedStart = ref(null);
const selectedEnd = ref(null);
const daysWrapper = ref(null);
const showMonthModal = ref(false);
const showYearModal = ref(false);

// Daftar tahun untuk dropdown (±10 tahun dari tahun saat ini)
const years = Array.from(
  { length: 21 },
  (_, i) => today.getFullYear() - 10 + i,
);

// Daftar bulan untuk dropdown
const months = monthNames.map((name, index) => ({ value: index, label: name }));

function generateMonthDays() {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();
  startDay.value = firstDay;
  monthDays.value = Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

async function prevMonth() {
  await animateMonthChange('left');
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  generateMonthDays();
  await nextTick();
  animateMonthEnter('right');
}

async function nextMonth() {
  await animateMonthChange('right');
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  generateMonthDays();
  await nextTick();
  animateMonthEnter('left');
}

function isToday(day) {
  const now = new Date();
  return (
    now.getDate() === day &&
    now.getMonth() === currentMonth.value &&
    now.getFullYear() === currentYear.value
  );
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function selectDate(day) {
  const date = formatDate(currentYear.value, currentMonth.value, day);
  if (props.mode === 'single') {
    emit('update:modelValue', date);
    emit('update:show', false);
  } else {
    if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
      selectedStart.value = date;
      selectedEnd.value = null;
    } else if (selectedStart.value && !selectedEnd.value) {
      selectedEnd.value = date;
      const startDate = new Date(selectedStart.value);
      const endDate = new Date(date);
      if (startDate > endDate) {
        [selectedStart.value, selectedEnd.value] = [date, selectedStart.value];
      }
      emit('update:modelValue', {
        start: selectedStart.value,
        end: selectedEnd.value,
      });
      emit('update:show', false);
    }
  }
}

function openMonthModal() {
  showMonthModal.value = true;
  nextTick(() => {
    gsap.from('.month-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

function openYearModal() {
  showYearModal.value = true;
  nextTick(() => {
    gsap.from('.year-modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

function selectMonth(monthValue) {
  currentMonth.value = monthValue;
  generateMonthDays();
  showMonthModal.value = false;
}

function selectYear(year) {
  currentYear.value = year;
  generateMonthDays();
  showYearModal.value = false;
}

// Animasi saat buka modal utama
watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick(() => {
        gsap.from('.date-picker-container', {
          scale: 0.9,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
        animateMonthEnter('fade');
      });
    }
  },
);

// Animasi keluar saat ganti bulan
function animateMonthChange(direction) {
  return new Promise((resolve) => {
    if (!daysWrapper.value) return resolve();
    gsap.to(daysWrapper.value.children, {
      x: direction === 'left' ? 20 : -20,
      opacity: 0,
      duration: 0.2,
      stagger: 0.01,
      onComplete: resolve,
    });
  });
}

// Animasi masuk hari-hari bulan baru
function animateMonthEnter(direction) {
  if (!daysWrapper.value) return;
  gsap.fromTo(
    daysWrapper.value.children,
    {
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
      opacity: 0,
    },
    { x: 0, opacity: 1, duration: 0.25, stagger: 0.01 },
  );
}

generateMonthDays();
</script>

<template>
  <BaseModal :show="show" @update:show="(val) => emit('update:show', val)">
    <div
      class="date-picker-container space-y-4 rounded-2xl bg-white p-4 shadow-card"
    >
      <!-- Navigasi Bulan dan Tahun -->
      <div class="flex items-center justify-between gap-2">
        <button
          class="rounded-lg p-2 hover:bg-gray-100 active:scale-95"
          @click="prevMonth"
        >
          <i class="ph ph-caret-left text-lg"></i>
        </button>
        <div class="flex gap-2">
          <button
            class="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-2 text-sm shadow-sm hover:bg-gray-50 active:scale-95"
            @click="openMonthModal"
          >
            {{ monthNames[currentMonth] }}
            <i class="ph ph-caret-down text-lg"></i>
          </button>
          <button
            class="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-2 text-sm shadow-sm hover:bg-gray-50 active:scale-95"
            @click="openYearModal"
          >
            {{ currentYear }}
            <i class="ph ph-caret-down text-lg"></i>
          </button>
        </div>
        <button
          class="rounded-lg p-2 hover:bg-gray-100 active:scale-95"
          @click="nextMonth"
        >
          <i class="ph ph-caret-right text-lg"></i>
        </button>
      </div>

      <!-- Nama Hari -->
      <div
        class="grid grid-cols-7 text-center text-sm font-medium text-gray-500"
      >
        <span v-for="day in days" :key="day">{{ day }}</span>
      </div>

      <!-- Tanggal -->
      <div ref="daysWrapper" class="grid grid-cols-7 gap-1 text-center">
        <span v-for="n in startDay" :key="'empty-' + n"></span>
        <button
          v-for="day in monthDays"
          :key="day"
          @click="selectDate(day)"
          :class="[
            'rounded-lg p-2 transition',
            isToday(day) ? 'bg-blue-100 font-bold' : '',
            props.mode === 'single' &&
            modelValue === formatDate(currentYear, currentMonth, day)
              ? 'bg-primary text-white'
              : props.mode === 'range' &&
                  selectedStart?.value ===
                    formatDate(currentYear, currentMonth, day)
                ? 'bg-primary text-white'
                : props.mode === 'range' &&
                    selectedEnd?.value ===
                      formatDate(currentYear, currentMonth, day)
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100',
          ]"
        >
          {{ day }}
        </button>
      </div>
    </div>
  </BaseModal>

  <!-- Modal Dropdown Bulan -->
  <BaseModal v-model:show="showMonthModal" position="bottom">
    <div class="month-modal-content p-4">
      <h2 class="mb-4 text-lg font-bold text-text">Pilih Bulan</h2>
      <ul class="max-h-64 space-y-2 overflow-y-auto">
        <li
          v-for="month in months"
          :key="month.value"
          class="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 active:scale-95"
          @click="selectMonth(month.value)"
        >
          <span>{{ month.label }}</span>
        </li>
      </ul>
    </div>
  </BaseModal>

  <!-- Modal Dropdown Tahun -->
  <BaseModal v-model:show="showYearModal" position="bottom">
    <div class="year-modal-content p-4">
      <h2 class="mb-4 text-lg font-bold text-text">Pilih Tahun</h2>
      <ul class="max-h-64 space-y-2 overflow-y-auto">
        <li
          v-for="year in years"
          :key="year"
          class="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 active:scale-95"
          @click="selectYear(year)"
        >
          <span>{{ year }}</span>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>

<style>
.date-picker-container,
.month-modal-content,
.year-modal-content {
  @apply relative z-10 mx-auto w-11/12 max-w-sm rounded-2xl bg-white p-4 shadow-card;
}
</style>
