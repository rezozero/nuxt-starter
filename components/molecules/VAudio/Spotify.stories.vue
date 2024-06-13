<script setup lang="ts">
import document from 'assets/stories/fixtures/documents/spotify-01.json'
</script>

<template>
    <NuxtStory>
        <VAudio :document="document" />
    </NuxtStory>
</template>
