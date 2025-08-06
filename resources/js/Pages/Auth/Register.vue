<script setup lang="ts">
import ToastNotification from "@/Components/ToastNotification.vue";
import { useToast } from "@/lib/toastBus";
import { Head, useForm } from "@inertiajs/vue3";
import gsap from "gsap";
import { onMounted, ref, watch } from "vue";

const isLoading = ref(false);
const form = useForm<{ email: string; name: string; password: string }>({
    email: "",
    name: "",
    password: "",
});

const formErrors = ref<{
    email: string | null;
    name: string | null;
    password: string | null;
}>({
    email: null,
    name: null,
    password: null,
});

function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailField(value: string) {
    if (!value) return "Email is required.";
    if (!validateEmail(value)) return "Invalid email format.";
    return null;
}

function validateNameField(value: string) {
    if (!value) return "Name is required.";
    if (value.length < 3) return "Name must be at least 3 characters.";
    return null;
}

function validatePasswordField(value: string) {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return null;
}

watch(
    () => form.email,
    (newVal) => {
        formErrors.value.email = validateEmailField(newVal);
    },
);

watch(
    () => form.name,
    (newVal) => {
        formErrors.value.name = validateNameField(newVal);
    },
);

watch(
    () => form.password,
    (newVal) => {
        formErrors.value.password = validatePasswordField(newVal);
    },
);

const triggerShakeAnimation = () => {
    gsap.fromTo(
        ".form-wrapper",
        { x: 0 },
        {
            x: 10,
            duration: 0.05,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
                gsap.set(".form-wrapper", { x: 0 });
            },
        },
    );
};

const handleSubmit = () => {
    formErrors.value.email = validateEmailField(form.email);
    formErrors.value.name = validateNameField(form.name);
    formErrors.value.password = validatePasswordField(form.password);

    const hasErrors =
        formErrors.value.email ||
        formErrors.value.name ||
        formErrors.value.password;

    if (hasErrors) {
        useToast().show("There are errors in the form.", "error");
        triggerShakeAnimation();
        return;
    }
    isLoading.value = true;
    form.post(route("register"), {
        onFinish: () => {
            isLoading.value = false;
        },
        onError: (errors) => {
            triggerShakeAnimation();
            console.log(errors);
        },
    });
};

onMounted(() => {
    gsap.set(".submit-button", { transition: "none" });

    gsap.set(".form-wrapper", { scale: 0.8, autoAlpha: 0 });
    gsap.set(".anim-item", { y: 30, autoAlpha: 0 });

    const tl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
            gsap.set(".submit-button", {
                transition: "all 0.3s ease-in-out",
            });
        },
    });

    tl.to(".form-wrapper", {
        scale: 1,
        autoAlpha: 1,
        ease: "back.out(1.7)",
        duration: 0.5,
    }).to(
        ".anim-item",
        { y: 0, autoAlpha: 1, stagger: 0.1, ease: "power2.out", duration: 0.4 },
        "-=0.2",
    );
});
</script>

<style lang="postcss">
.form-container {
    @apply h-dvh flex items-center justify-center bg-main-300;
}

.form-wrapper {
    @apply bg-main-200 p-8 rounded-3xl w-4/5;
}

.form {
    @apply grid grid-cols-1 gap-4;
}

.form-header {
    @apply text-center text-main-600;

    h1 {
        @apply text-title font-bold;
    }

    span {
        @apply text-subtitle;
    }
}

.form-group {
    @apply flex flex-col;

    label {
        @apply ml-3 text-main-600 text-subtitle font-medium;
    }

    input[type="text"],
    input[type="password"] {
        @apply bg-main-100 border-none;
        height: 41px;
        border-radius: 18px;

        &.error {
            @apply outline outline-red-600 outline-2;
        }
    }
}

.submit-button {
    @apply w-full bg-main-300 px-8 py-4 text-main-600 disabled:bg-gray-600 disabled:text-main-100 text-subtitle font-bold;
    border-radius: 30px;
}

.forget-password {
    @apply text-subtext text-end;
}
</style>

<template>
    <Head title="Login" />

    <ToastNotification />
    <main class="form-container">
        <section class="form-wrapper shadow-sm">
            <form class="form" @submit.prevent="handleSubmit()">
                <div class="form-header anim-item">
                    <h1>Arusku</h1>
                    <span>Plan and Track your Money.</span>
                </div>
                <div class="form-group anim-item">
                    <label for="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        v-model="form.email"
                    />
                    <p
                        v-if="formErrors.email"
                        class="text-red-600 text-sm mt-1 ml-3"
                    >
                        {{ formErrors.email }}
                    </p>
                </div>
                <div class="form-group anim-item">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="username"
                        v-model="form.name"
                    />
                    <p
                        v-if="formErrors.name"
                        class="text-red-600 text-sm mt-1 ml-3"
                    >
                        {{ formErrors.name }}
                    </p>
                </div>
                <div class="form-group anim-item">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        v-model="form.password"
                    />
                    <p
                        v-if="formErrors.password"
                        class="text-red-600 text-sm mt-1 ml-3"
                    >
                        {{ formErrors.password }}
                    </p>
                </div>
                <div class="flex flex-col items-center mt-4">
                    <button
                        type="submit"
                        class="submit-button anim-item"
                        :class="{ 'animate-pulse': isLoading }"
                        :disabled="!form.email || !form.password || isLoading"
                    >
                        <span v-if="!isLoading">Login</span>
                        <span v-else>Loading...</span>
                    </button>
                    <a
                        href="/"
                        class="text-subtext font-light underline text-center mt-4 anim-item"
                        >Already Have an Account?</a
                    >
                </div>
            </form>
        </section>
    </main>
</template>
