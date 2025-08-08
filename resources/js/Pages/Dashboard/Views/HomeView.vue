<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "../Layouts/AppLayout.vue";
import gsap from "gsap";
import AnimatedTabs from "@/Components/AnimatedTabs.vue";
import BudgetPlanItemCard from "../Partials/BudgetPlanItemCard.vue";
import { usePage } from "@inertiajs/vue3";
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ComposeOption } from "echarts/core";
import type { PieSeriesOption } from "echarts/charts";
import type {
    TitleComponentOption,
    TooltipComponentOption,
    LegendComponentOption,
} from "echarts/components";
import VChart from "vue-echarts";

use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
]);

type EChartsOption = ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
    | PieSeriesOption
>;

const currentBalance = ref(0);
const totalExpenses = ref(0);
const user = usePage().props.auth.user;
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

const expenseValues = ref([300000, 50000, 100000, 70000, 120000]);
const expenseLabels = ref([
    "Makanan",
    "Transportasi",
    "Hiburan",
    "Belanja",
    "Tagihan",
]);
const chartBackgroundColors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
];

const chartBorderColors = ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"];

const chartOptions = ref<EChartsOption>({
    title: {
        text: "Pengeluaran",
        left: "center",
    },
    tooltip: {
        trigger: "item",
    },
    legend: {
        show: false,
        orient: "vertical",
        left: "left",
        textStyle: {
            color: "#333",
        },
    },
    series: [
        {
            name: "Pengeluaran",
            type: "pie",
            radius: "50%",
            data: expenseValues.value.map((val, idx) => ({
                value: val,
                name: expenseLabels.value[idx],
                itemStyle: {
                    color: chartBackgroundColors[idx],
                    borderColor: chartBorderColors[idx],
                    borderWidth: 2,
                },
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    ],
});
defineExpose();
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
    border-radius: 10px;
}

.bottom-plan-panel {
    @apply p-4;
}
</style>

<template>
    <AppLayout>
        <template #top-section>
            <section class="top-greetings">
                <div>
                    <h1>Hi, {{ user.name }}</h1>
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
                        <BudgetPlanItemCard
                            title="Makan"
                            :amount="300000"
                            :percentage="10"
                        />

                        <BudgetPlanItemCard
                            title="Transport"
                            :amount="300000"
                            :percentage="50"
                        />
                        <BudgetPlanItemCard
                            title="Lifestyle"
                            :amount="200000"
                            :percentage="80"
                        />
                    </section>
                </template>

                <template #content-plan-graph>
                    <section class="bottom-plan-panel">
                        <div class="">
                            <v-chart
                                class="chart"
                                :option="chartOptions"
                                autoresize
                                style="width: 100%; height: 300px"
                            />
                        </div>
                    </section>
                </template>
            </AnimatedTabs>
            <section>
                <h1>Recently Transaction</h1>
            </section>
        </template>
    </AppLayout>
</template>
