<script setup lang="ts">
const index = ref(0)
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VCarouselControls
                v-model:index="index"
                :snap-length="3"
                display-numbers
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="without numbers">
            <VCarouselControls
                v-model:index="index"
                :snap-length="3"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
