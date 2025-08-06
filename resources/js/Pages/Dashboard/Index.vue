<script setup lang="ts">
import { Head, usePage } from "@inertiajs/vue3";

const user = usePage().props.auth.user;
</script>

<template>

    <Head title="Dashboard" />

    <main>
        <h1>Dashboard Page</h1>
        <pre>{{ user }}</pre>
    </main>
</template>
