<script setup lang="ts">
import { vButtonSizes as sizes } from '~/components/molecules/VButton/VButton.vue'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VButton v-for="size in sizes" :key="size" :label="`Button label ${size}`" :size="size" icon-name="check" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Filled">
            <VButton
                v-for="size in sizes"
                :key="size"
                :label="`Button label ${size}`"
                :size="size"
                icon-name="check"
                filled
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Outlined">
            <VButton
                v-for="size in sizes"
                :key="size"
                :label="`Button label ${size}`"
                :size="size"
                icon-name="check"
                outlined
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
