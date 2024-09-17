<script setup lang="ts">
import document from '~/assets/stories/fixtures/documents/deezer-01.json'
</script>

<template>
    <NuxtStory>
        <VRoadizAudio :document="document" />
    </NuxtStory>
</template>
