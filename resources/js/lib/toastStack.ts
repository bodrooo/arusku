import { ref } from 'vue';

// Stack untuk menyimpan toast
const toasts = ref<
  Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    duration?: number;
  }>
>([]);
const maxToasts = 2; // Batas maksimum toast

// Fungsi untuk menambah toast
export const pushToast = ({
  title,
  message,
  type = 'error',
  duration = 2000,
}: {
  id: number;
  title: string;
  message: string;
  type: string;
  duration?: number;
}) => {
  // Jika batas tercapai, hapus toast tertua
  if (toasts.value.length >= maxToasts) {
    toasts.value.shift(); // Hapus toast tertua
  }

  const id = Date.now(); // ID unik untuk toast
  toasts.value.push({ id, title, message, type });

  // Otomatis tutup setelah durasi
  setTimeout(() => {
    closeToast(id);
  }, duration);
};

// Fungsi untuk menutup toast
export const closeToast = (id: number) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1); // Hapus dari stack
  }
};

// Expose toasts dan fungsi
export const useToastStore = () => {
  return {
    toasts,
    pushToast,
    closeToast,
  };
};
