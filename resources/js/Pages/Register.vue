<script setup lang="ts">
import { Head } from "@inertiajs/vue3";
import gsap from "gsap";
import { onMounted, ref, watch } from "vue";

const isLoading = ref(false);
const form = ref<{ email: string; username: string; password: string }>({
    email: "",
    username: "",
    password: "",
});

const formErrors = ref<{
    email: string | null;
    username: string | null;
    password: string | null;
}>({
    email: null,
    username: null,
    password: null,
});
function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailField(value: string) {
    if (!value) return "Email wajib diisi.";
    if (!validateEmail(value)) return "Format email tidak valid.";
    return null;
}
function validateUsernameField(value: string) {
    if (!value) return "Username wajib diisi.";
    return null;
}
function validatePasswordField(value: string) {
    if (!value) return "Password wajib diisi.";
    return null;
}

watch(
    () => form.value.email,
    (newVal) => {
        formErrors.value.email = validateEmailField(newVal);
    },
);

watch(
    () => form.value.username,
    (newVal) => {
        formErrors.value.username = validateUsernameField(newVal);
    },
);

watch(
    () => form.value.password,
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
    if (!validateEmail(form.value.email)) {
        triggerShakeAnimation();
        return;
    }
    if (!form.value.email || !form.value.username || !form.value.password) {
        // useToast().show("Email dan Kata Sandi wajib diisi.", "error");
        triggerShakeAnimation();
        return;
    }

    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
        if (
            (form.value.email === "test@joglo.local" &&
                form.value.username === "test",
            form.value.password === "test")
        ) {
            // useToast().show("Login berhasil!");
        } else {
            // useToast().show("Username atau kata sandi salah.", "error");
            triggerShakeAnimation();
        }
    }, 1500);
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
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        v-model="form.username"
                    />
                    <p
                        v-if="formErrors.username"
                        class="text-red-600 text-sm mt-1 ml-3"
                    >
                        {{ formErrors.username }}
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
