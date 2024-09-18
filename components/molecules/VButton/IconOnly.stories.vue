<script setup lang="ts">
import { vButtonSizes as sizes } from '~/components/molecules/VButton/VButton.vue'
</script>

<template>
    <NuxtStory>
        <VStoryThemeProvider>
            <VButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                theme="light"
                filled
                icon-name="check"
            />
        </VStoryThemeProvider>
        <VStoryThemeProvider>
            <VButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                theme="dark"
                filled
                icon-name="check"
            />
        </VStoryThemeProvider>
        <VStoryThemeProvider>
            <VButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                filled
                icon-name="check"
            />
        </VStoryThemeProvider>
        <VStoryThemeProvider>
            <VButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                outlined
                icon-name="check"
            />
        </VStoryThemeProvider>
    </NuxtStory>
</template>
