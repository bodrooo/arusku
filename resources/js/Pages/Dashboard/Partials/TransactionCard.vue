<template>
    <div class="transaction-card">
        <div class="transaction-card-icon">
            <component :is="icon" />
        </div>
        <div class="transaction-card-detail">
            <span class="transaction-card-detail-title">{{ title }}</span>
            <div class="transaction-card-detail-info">
                <span>{{ amount }}</span>
                <span>{{ date }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: any;
    title: string;
    amount: string;
    date: string;
}>();
</script>

<style lang="postcss">
.transaction-card {
    @apply grid items-center p-2 gap-2;
    grid-template-rows: 56px;
    grid-template-columns: 48px 1fr;

    .transaction-card-icon {
        @apply size-12 grid place-items-center bg-blue-400 rounded-xl text-main-200;

        svg {
            @apply size-8;
        }
    }

    .transaction-card-detail {
        @apply h-full;

        .transaction-card-detail-title {
            @apply text-title font-bold;
        }

        .transaction-card-detail-info {
            @apply flex items-center justify-between text-subtitle font-bold;
        }
    }
}
</style>
