<script setup lang="ts">
import { vButtonSizes } from '~/components/molecules/VButton/VButton.vue'

const commonsProps = {
    label: 'Default label',
}
</script>

<template>
    <NuxtStory>
        <VStoryThemeProvider>
            <NuxtStoryVariant title="low">
                <VButton
                    v-for="size in vButtonSizes"
                    :key="`${size}-low`"
                    :size="size"
                    v-bind="commonsProps"
                    emphasis="low"
                />
            </NuxtStoryVariant>
            <NuxtStoryVariant title="medium">
                <VButton
                    v-for="size in vButtonSizes"
                    :key="`${size}-medium`"
                    :size="size"
                    v-bind="commonsProps"
                    emphasis="medium"
                />
            </NuxtStoryVariant>
            <NuxtStoryVariant title="high">
                <VButton
                    v-for="size in vButtonSizes"
                    :key="`${size}-high`"
                    :size="size"
                    v-bind="commonsProps"
                    emphasis="high"
                />
            </NuxtStoryVariant>
        </VStoryThemeProvider>
    </NuxtStory>
</template>
