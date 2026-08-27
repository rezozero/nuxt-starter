<script setup lang="ts">
import video from '~stories/assets/fixtures/documents/youtube-01.json'

const { open } = useMediaViewer()

onMounted(() => open([video], 0))
</script>

<template>
    <NuxtStory>
        <VMediaViewerTransition />
    </NuxtStory>
</template>
