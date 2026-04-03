<script setup lang="ts">
import document from '~stories/assets/fixtures/documents/spotify-01.json'
</script>

<template>
    <NuxtStory>
        <VRoadizAudio :document="document" />
    </NuxtStory>
</template>
