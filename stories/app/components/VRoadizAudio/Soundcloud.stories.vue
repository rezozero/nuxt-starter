<script setup lang="ts">
import document from '~stories/assets/fixtures/documents/soundcloud-01.json'
</script>

<template>
    <NuxtStory>
        <VRoadizAudio :document="document" />
    </NuxtStory>
</template>
