<script setup lang="ts">
import type { VSelectOption } from '~/components/molecules/VSelect/VSelect.vue'

const options: VSelectOption[] = [...Array(7)].map((_, i) => ({
    value: i.toString(),
    label: `Option ${i}`,
}))
</script>

<template>
    <NuxtStory>
        <VSelect :options="options" placeholder="Please select" />
    </NuxtStory>
</template>
