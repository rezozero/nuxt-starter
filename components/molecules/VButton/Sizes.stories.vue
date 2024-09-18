<script setup lang="ts">
import { vButtonSizes as sizes } from '~/components/molecules/VButton/VButton.vue'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Filled with size props">
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                icon-name="check"
                filled
            />
            <div data-backspace />
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                icon-name="check"
                filled
                disabled
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Outlined with size props">
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                icon-name="check"
                outlined
            />
            <div data-backspace />
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                icon-name="check"
                outlined
                disabled
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="ternary with size props">
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                icon-name="check"
            />
            <div data-backspace />
            <VButton
                v-for="size in sizes"
                :key="size"
                label="Button label"
                :size="size"
                emphasis="ternary"
                icon-name="check"
                disabled
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
