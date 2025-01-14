<script lang="ts" setup>
import image from 'assets/stories/fixtures/documents/image-01.json'
import imagePortrait from 'assets/stories/fixtures/documents/image-portrait.json'
import video from 'assets/stories/fixtures/documents/video-01.json'
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

<!-- <style lang="scss" module></style> -->
