<script setup lang="ts">
defineProps({
    name: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <NuxtIcon
        :name="'icon:' + name"
    />
</template>
