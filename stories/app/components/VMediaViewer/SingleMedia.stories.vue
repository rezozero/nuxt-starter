<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import image03 from '~stories/assets/fixtures/documents/image-03.json'

const { open } = useMediaViewer()

const documents = [image03].map(d => d as unknown as RoadizDocument)

onMounted(() => open(documents, 0))
</script>

<template>
    <NuxtStory>
        <VMediaViewerTransition />
    </NuxtStory>
</template>
