<script lang="ts" setup>
import image from '~stories/assets/fixtures/documents/image-01.json'
import imagePortrait from '~stories/assets/fixtures/documents/image-portrait.json'
import video from '~stories/assets/fixtures/documents/video-01.json'
import type { RoadizDocument } from '@roadiz/types'
import { useMediaViewer } from '~/composables/use-media-viewer'

const documents = [image, imagePortrait, video, image, video, image] as RoadizDocument[]
const { isOpen, open } = useMediaViewer()

function onOpenClick() {
    open(documents, 0)
}
</script>

<template>
    <NuxtStory>
        <button @click="onOpenClick">
            Open
        </button>
        <VMediaViewerTransition :is-open="isOpen" />
    </NuxtStory>
</template>
