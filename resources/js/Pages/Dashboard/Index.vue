<script setup lang="ts">
import { ref, computed } from "vue";
import { Head } from "@inertiajs/vue3";
import BottomNavigation from "./Partials/BottomNavigation.vue";

import HomeView from "./Views/HomeView.vue";
import TransactionView from "./Views/TransactionView.vue";
import MoreView from "./Views/MoreView.vue";

type TabName = "Transaction" | "Home" | "More";

const activeTab = ref<TabName>("Home");
const activeIndex = ref(1);

const tabComponents: Record<TabName, any> = {
    Transaction: TransactionView,
    Home: HomeView,
    More: MoreView,
};

const activeTabComponent = computed(() => tabComponents[activeTab.value]);
</script>

<template>

    <Head title="Dashboard" />

    <main id="root">
        <main id="root-wrapper">
            <component :is="activeTabComponent" />
        </main>
        <BottomNavigation v-model:modelValue="activeTab" v-model:modelIndex="activeIndex" />
    </main>
</template>

<style lang="postcss">
#root {
    --bottom-navigation-height: 160px;

    @apply bg-main-300;
    height: 100dvh;
    display: grid;
    grid-template-rows: 1fr var(--bottom-navigation-height);
}
</style>
