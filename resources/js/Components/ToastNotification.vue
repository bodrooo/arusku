<script setup>
import { useToast } from "@/lib/toastBus.js";

const { isVisible, message, type } = useToast();
</script>

<template>
    <transition name="toast">
        <div
            v-if="isVisible"
            class="toast-wrapper"
            :class="type === 'success' ? 'toast-success' : 'toast-error'"
        >
            <div class="toast-icon">
                <i
                    v-if="type === 'success'"
                    class="ri-checkbox-circle-fill"
                ></i>
                <i v-else class="ri-close-circle-fill"></i>
            </div>
            <p class="toast-message">{{ message }}</p>
        </div>
    </transition>
</template>

<style lang="postcss">
.toast-wrapper {
    @apply fixed top-5 right-5 z-50 flex items-center gap-4 rounded-lg p-4 text-white shadow-2xl;
    min-width: 250px;
}

.toast-success {
    @apply bg-green-600;
}

.toast-info {
    @apply bg-blue-600;
}

.toast-error {
    @apply bg-red-600;
}

.toast-icon {
    @apply text-2xl;
}

.toast-message {
    @apply text-sm font-semibold;
}

/* Transisi untuk toast */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
