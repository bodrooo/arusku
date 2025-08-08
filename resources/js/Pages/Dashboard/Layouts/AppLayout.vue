<script setup>
import gsap from "gsap";
import { onMounted } from "vue";

onMounted(() => {
    gsap.from(".bottom-section", {
        y: "100%",
        duration: 0.5,
        ease: "power2.out",
    });

    gsap.to(".bottom-section", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
    });
});
</script>

<template>
    <section class="top-section">
        <slot name="top-section"></slot>
    </section>
    <section class="bottom-section">
        <slot name="bottom-section"></slot>
    </section>
</template>

<style lang="postcss">
#root-wrapper {
    --top-section-height: 200px;
    display: grid;
    grid-template-rows: var(--top-section-height) 1fr;
}

.top-section {
    @apply bg-main-300;
}

.bottom-section {
    --corner-mixed: 50px;
    @apply bg-main-100 pb-12;
    border-radius: var(--corner-mixed) var(--corner-mixed) 0 0;
}
</style>
