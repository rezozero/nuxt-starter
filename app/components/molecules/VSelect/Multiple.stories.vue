<script setup lang="ts">
import type { VSelectOption } from '~/components/molecules/VSelect/VSelect.vue'

const options: VSelectOption[] = [...Array(4)].map((_, i) => ({
    value: i.toString(),
    label: `Option ${i}`,
}))
</script>

<template>
    <NuxtStory>
        <VSelect
            :options="options"
            multiple
        />
    </NuxtStory>
</template>
