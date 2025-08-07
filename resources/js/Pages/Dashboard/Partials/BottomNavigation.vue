<script setup>
import Atom2Icon from "@/Components/Icons/Atom2Icon.vue";
import HomeSimpleIcon from "@/Components/Icons/HomeSimpleIcon.vue";
import MenuIcon from "@/Components/Icons/MenuIcon.vue";
import gsap from "gsap";
import { onMounted, onUnmounted, ref, nextTick, watch } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        default: "Home",
    },
    modelIndex: {
        type: Number,
        default: 1,
    },
});

const emit = defineEmits(["update:modelValue", "update:modelIndex"]);
const navButtons = ref([]);
const tl = gsap.timeline();
const sliderRef = ref(null);
const iconRefs = ref([]);
const buttonMetrics = ref([]);
const ANIMATION_DURATION = 600;
const isTransitioning = ref(false);

const calculateMetrics = () => {
    const navElement = navButtons.value[0]?.closest(
        ".bottom-navigation-wrapper",
    );
    if (!navElement) return;

    const navRect = navElement.getBoundingClientRect();

    buttonMetrics.value = navButtons.value.map((button) => {
        const buttonRect = button.getBoundingClientRect();
        console.log({ btn: buttonRect.left, nav: navRect.left });
        return {
            // width: buttonRect.width,
            width: 82,
            left: buttonRect.left - navRect.left - 41,
        };
    });
};

const isActive = (tab) => {
    return props.modelValue === tab;
};

const updateSlider = (animated = true) => {
    if (buttonMetrics.value.length === 0 || !sliderRef.value) return;
    const metrics = buttonMetrics.value[props.modelIndex];
    if (!metrics) return;

    iconRefs.value.forEach((icon, index) => {
        if (icon) {
            gsap.to(icon, {
                y: index === props.modelIndex ? "-50%" : "0%",
                duration: 0.5,
                ease: "back.out(1.7)",
            });
        }
    });
    if (animated) {
        gsap.to(sliderRef.value, {
            width: metrics.width,
            height: metrics.width,
            x: metrics.left,
            duration: ANIMATION_DURATION / 1000,
            ease: "power3.inOut",
            overwrite: "auto",
        });
    } else {
        gsap.set(sliderRef.value, {
            width: metrics.width,
            height: metrics.width,
            x: metrics.left,
        });
    }
};

const selectTab = (tabName, index) => {
    if (isTransitioning.value) {
        return;
    }
    if (props.modelIndex === index) {
        return;
    }

    isTransitioning.value = true;

    emit("update:modelValue", tabName);
    emit("update:modelIndex", index);

    localStorage.setItem("lastActiveTab", tabName);
    localStorage.setItem("lastActiveIndex", index);

    setTimeout(() => {
        isTransitioning.value = false;
    }, ANIMATION_DURATION);
};

watch(
    () => props.modelIndex,
    (_newIndex, oldIndex) => {
        nextTick(() => {
            updateSlider(oldIndex !== undefined);
        });
    },
    { immediate: true },
);

onMounted(() => {
    tl.from("footer", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.3,
        ease: "power2.out",
    });

    tl.from(
        "footer nav button",
        {
            scale: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.1,
        },
        "<0.1",
    );
    const storedTab = localStorage.getItem("lastActiveTab");
    const storedIndex = localStorage.getItem("lastActiveIndex");

    if (storedTab && storedIndex !== null) {
        emit("update:modelValue", storedTab);
        emit("update:modelIndex", parseInt(storedIndex, 10));
    }

    nextTick(() => {
        calculateMetrics();
        updateSlider(false);
    });

    window.addEventListener("resize", () => {
        calculateMetrics();
        updateSlider(false);
    });
});

onUnmounted(() => {
    const resizeHandler = () => {
        calculateMetrics();
        updateSlider(false);
    };
    window.removeEventListener("resize", resizeHandler);
});
</script>

<style lang="postcss">
.bottom-navigation-container {
    @apply flex items-end;
    height: var(--bottom-navigation-height);
}

.bottom-navigation-wrapper {
    @apply grid grid-cols-3 w-full bg-main-200 relative;
    height: calc(var(--bottom-navigation-height) / 2);
    border-radius: 30px 30px 0 0;
}

.bottom-navigation-menu {
    @apply flex items-center justify-center;

    span {
        @apply relative p-4 rounded-full;
        will-change: transform;

        svg {
            @apply size-8;
        }
    }

    &.active-tab span {
        svg {
            @apply size-12 text-main-400;
        }
    }
}

.bottom-navigation-slider {
    @apply bg-main-300 absolute;
    height: calc(var(--bottom-navigation-height) / 2);
    transform: translateY(-50%);
    border-radius: 30px;
    will-change: transform, width;
}
</style>

<template>
    <footer class="bottom-navigation-container">
        <nav class="bottom-navigation-wrapper">
            <div class="bottom-navigation-slider" ref="sliderRef"></div>
            <button class="bottom-navigation-menu" :ref="(el) => (navButtons[0] = el)"
                :class="{ 'active-tab': isActive('Transaction') }" @click="selectTab('Transaction', 0)">
                <span :ref="(el) => (iconRefs[0] = el)">
                    <Atom2Icon />
                </span>
            </button>
            <button class="bottom-navigation-menu" :ref="(el) => (navButtons[1] = el)"
                :class="{ 'active-tab': isActive('Home') }" @click="selectTab('Home', 1)">
                <span :ref="(el) => (iconRefs[1] = el)">
                    <HomeSimpleIcon />
                </span>
            </button>
            <button class="bottom-navigation-menu" :ref="(el) => (navButtons[2] = el)"
                :class="{ 'active-tab': isActive('More') }" @click="selectTab('More', 2)">
                <span :ref="(el) => (iconRefs[2] = el)">
                    <MenuIcon />
                </span>
            </button>
        </nav>
    </footer>
</template>
