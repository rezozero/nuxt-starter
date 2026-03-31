<script setup lang="ts">
const index = ref(0)
</script>

<template>
    <NuxtStory>
        <VCarouselProgress
            v-model:index="index"
            :snap-length="3"
        />
    </NuxtStory>
</template>
