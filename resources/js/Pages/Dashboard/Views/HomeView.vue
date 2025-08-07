<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "../Layouts/AppLayout.vue";
import gsap from "gsap";
import AnimatedTabs from "@/Components/AnimatedTabs.vue";

const currentBalance = ref(0);
const totalExpenses = ref(0);

const tabs = ref([
    { id: "plan-normal", title: "Budget Plan" },
    { id: "plan-graph", title: "Graph" },
]);
const activeTabIndex = ref(0);
const showTabs = ref(true);

const balanceDisplay = ref<HTMLElement | null>(null);
const expenseDisplay = ref<HTMLElement | null>(null);

const createAnimatedNumberWatcher = (valueRef: any, displayRef: any) => {
    return watch(valueRef, (newValue, oldValue) => {
        if (!displayRef.value) return;
        let obj = { value: oldValue || 0 };
        gsap.to(obj, {
            value: newValue,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                if (displayRef.value) {
                    displayRef.value.innerText = new Intl.NumberFormat(
                        "id-ID",
                        {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        },
                    )
                        .format(obj.value)
                        .replace(/^Rp/, "IDR ");
                }
            },
        });
    });
};

createAnimatedNumberWatcher(currentBalance, balanceDisplay);
createAnimatedNumberWatcher(totalExpenses, expenseDisplay);

onMounted(() => {
    if (balanceDisplay.value) balanceDisplay.value.innerText = "IDR 0";
    if (expenseDisplay.value) expenseDisplay.value.innerText = "IDR 0";

    gsap.from(".top-greetings h1", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "back.out(1.7)",
    });

    gsap.from(".top-greetings span", {
        opacity: 0,
        y: 20,
        delay: 0.3,
        duration: 1,
        ease: "power2.out",
    });

    setTimeout(() => {
        totalExpenses.value = 600000;
        currentBalance.value = 2100000;
    }, 500);
});
</script>

<style lang="postcss">
.top-section {
    @apply px-8 mt-8;
}

.bottom-section {
    @apply pt-8 px-4;
}

.top-greetings {
    @apply text-main-200;

    h1 {
        @apply text-title font-bold;
    }

    span {
        @apply text-subtext;
    }
}

.top-balance {
    @apply grid place-items-center text-main-200;
    height: 100px;
    grid-template-columns: 1fr 1px 1fr;

    div {
        span {
            @apply text-subtext font-normal;
        }

        h1 {
            @apply font-bold text-title;
            margin-top: -10px;
        }
    }

    div:nth-child(3) {
        @apply text-red-600;
    }
}

.divider {
    @apply bg-main-200;
    width: 2px;
    height: 100px;
}

.content-container {
    @apply bg-main-200 p-2;
}

.bottom-plan-panel {
    @apply p-2;
}
</style>

<template>
    <AppLayout>
        <template #top-section>
            <section class="top-greetings">
                <div>
                    <h1>Hi, Bodrooo</h1>
                    <span>Good Morning</span>
                </div>
            </section>
            <section class="top-balance">
                <div>
                    <span>Balance</span>
                    <h1 ref="balanceDisplay">IDR 0</h1>
                </div>
                <div class="divider"></div>
                <div>
                    <span>Expense</span>
                    <h1 ref="expenseDisplay">IDR 0</h1>
                </div>
            </section>
        </template>
        <template #bottom-section>
            <AnimatedTabs
                v-model="activeTabIndex"
                :tabs="tabs"
                :show="showTabs"
            >
                <template #content-plan-normal>
                    <section class="bottom-plan-panel">
                        This is the Budget Plan content
                    </section>
                </template>

                <template #content-plan-graph>
                    <section class="bottom-plan-panel">
                        This is the Graph content
                    </section>
                </template>
            </AnimatedTabs>
        </template>
    </AppLayout>
</template>
