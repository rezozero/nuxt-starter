<script setup lang="ts">
defineProps({
    name: {
        type: String,
        required: true,
    },
    width: {
        type: String,
        default: '24',
    },
    height: {
        type: String,
        default: '24',
    },
})
</script>

<template>
    <SvgIcon
        :name="name"
        :width="width"
        :height="height"
    />
</template>
