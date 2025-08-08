<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import gsap from "gsap";

const props = defineProps<{
    title: string;
    amount: number;
    percentage: number;
}>();

const barRef = ref<HTMLElement | null>(null);

watch(
    () => props.percentage,
    (newVal) => {
        if (barRef.value) {
            gsap.to(barRef.value, {
                width: `${newVal}%`,
                duration: 1,
                ease: "power2.out",
            });
        }
    },
    { immediate: true },
);

onMounted(() => {
    gsap.to(barRef.value, {
        width: `${props.percentage}%`,
        duration: 1,
        ease: "power2.out",
    });
});

const formattedAmount = computed(() => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    })
        .format(props.amount)
        .replace(/^Rp/, "IDR ");
});
</script>

<template>
    <article class="budget-plan-item-card">
        <div class="budget-plan-item-card-head">
            <h1>{{ title }}</h1>
            <span>{{ formattedAmount }}</span>
        </div>
        <div class="budget-plan-item-card-stats">
            <div>
                <span ref="barRef"></span>
            </div>
        </div>
    </article>
</template>

<style scoped lang="postcss">
.budget-plan-item-card {
    @apply mb-4;

    .budget-plan-item-card-head {
        @apply flex justify-between text-subtitle font-bold mb-2;
    }

    .budget-plan-item-card-stats {
        @apply h-2 w-full overflow-hidden rounded bg-main-100;

        div {
            @apply bg-main-600 w-full h-full relative;

            span {
                @apply absolute left-0 top-0 h-full bg-main-300;
                width: 0%;
            }
        }
    }
}
</style>
