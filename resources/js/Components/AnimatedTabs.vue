<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";
import { gsap } from "gsap";

const props = defineProps({
    tabs: { type: Array, required: true },
    modelValue: { type: Number, default: 0 },
    show: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const activeTab = ref(props.modelValue);
const isTransitioning = ref(false);

const tabButtons = ref([]);
const sliderRef = ref(null);
const contentRefs = ref([]);
const contentContainer = ref(null);

let tlContent, tlSlider;

const gridStyle = computed(() => {
    return {
        "grid-template-columns": `repeat(${props.tabs.length}, minmax(0, 1fr))`,
    };
});

const animateSlider = async (animated = true) => {
    await nextTick();
    const activeTabButton = tabButtons.value[activeTab.value];
    if (!activeTabButton || !sliderRef.value) return;
    if (tlSlider) tlSlider.kill();
    gsap.to(sliderRef.value, {
        x: activeTabButton.offsetLeft,
        width: activeTabButton.offsetWidth,
        duration: animated ? 0.6 : 0,
        ease: "power2.inOut",
    });
};

const animateContent = async (oldIndex, newIndex) => {
    await nextTick();
    const oldContent = contentRefs.value[oldIndex];
    const newContent = contentRefs.value[newIndex];
    if (!oldContent || !newContent || newContent.offsetHeight === 0) {
        isTransitioning.value = false;
        return;
    }

    if (tlContent) tlContent.kill();

    const newHeight = newContent.offsetHeight;
    tlContent = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.6 },
        onComplete: () => {
            isTransitioning.value = false;
        },
    });

    gsap.set(newContent, { autoAlpha: 1 });
    gsap.set(oldContent, { autoAlpha: 0 });

    tlContent
        .to(contentContainer.value, { height: newHeight, duration: 0.4 }, 0.2)
        .fromTo(
            newContent,
            { x: newIndex > oldIndex ? 50 : -50, autoAlpha: 0 },
            { x: 0, autoAlpha: 1 },
            0,
        );
};

const setActiveTab = async (index) => {
    if (isTransitioning.value || activeTab.value === index) return;
    isTransitioning.value = true;
    const oldIndex = activeTab.value;
    activeTab.value = index;
    emit("update:modelValue", index);
    await animateSlider();
    await animateContent(oldIndex, index);
};

watch(
    () => props.modelValue,
    (newIndex) => {
        if (newIndex !== activeTab.value) {
            setActiveTab(newIndex);
        }
    },
);

const initializeVisuals = async () => {
    await nextTick();
    if (contentRefs.value[activeTab.value]) {
        gsap.set(contentContainer.value, {
            height: contentRefs.value[activeTab.value].offsetHeight,
        });
    }
    animateSlider(false);
};

watch(
    () => props.show,
    (isShown) => {
        if (isShown) {
            initializeVisuals();
        }
    },
);

let resizeHandler;
onMounted(() => {
    initializeVisuals();

    resizeHandler = () => {
        if (props.show) {
            initializeVisuals();
        }
    };
    window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
    if (tlContent) tlContent.kill();
    if (tlSlider) tlSlider.kill();
});
</script>

<template>
    <div>
        <div class="base-space">
            <div class="animated-tabs-container" :style="gridStyle">
                <div class="slider" ref="sliderRef"></div>
                <button
                    v-for="(tab, index) in tabs"
                    :key="tab.id"
                    :ref="(el) => (tabButtons[index] = el)"
                    @click="setActiveTab(index)"
                    :class="{ 'active-tab': activeTab === index }"
                >
                    {{ tab.title }}
                </button>
            </div>
        </div>

        <div ref="contentContainer" class="content-container">
            <div
                v-for="(tab, index) in tabs"
                :key="tab.id"
                :ref="(el) => (contentRefs[index] = el)"
                :style="{
                    visibility: activeTab !== index ? 'hidden' : 'visible',
                }"
                class="content-panel"
            >
                <slot :name="`content-${tab.id}`"></slot>
            </div>
        </div>
    </div>
</template>

<style lang="postcss">
.animated-tabs-container {
    @apply relative grid gap-2 p-2 text-main-600 rounded-full bg-main-200;
    @apply mb-4;
}

.animated-tabs-container button {
    @apply z-10 text-center py-2 px-4 rounded-full font-medium text-main-600 transition-colors duration-300;
}

.animated-tabs-container .slider {
    @apply bg-main-300 absolute rounded-full shadow;
    top: 6px;
    bottom: 6px;
    will-change: transform, width;
}

.content-container {
    @apply relative w-full overflow-hidden mt-4;
}

.content-panel {
    @apply absolute top-0 left-0 w-full;
}
</style>
