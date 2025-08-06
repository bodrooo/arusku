import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const isVisible = ref(false);
const message = ref('');
const type = ref<ToastType>('success');

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function useToast() {
    const show = (newMessage: string, newType: ToastType = 'success', duration = 3000) => {
        message.value = newMessage;
        type.value = newType;
        isVisible.value = true;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            isVisible.value = false;
        }, duration);
    };

    return {
        isVisible,
        message,
        type,
        show,
    };
}
