<script setup lang="ts">
import type { FormElementProps } from '~~/types/form'

defineProps<FormElementProps>()
</script>

<template>
    <input
        :id="id"
        type="hidden"
        :name="name"
        :value="modelValue"
    >
</template>
