<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import { useMediaViewer } from '~/composables/use-media-viewer'
import video from '~/assets/stories/fixtures/documents/video-01.json'

const documents = [video, video, video, video] as RoadizDocument[]
const { isOpen, open } = useMediaViewer()

function onOpenClick() {
    open(documents, 0)
}
</script>

<template>
    <NuxtStory>
        <VButton
            v-if="!isOpen"
            label="open"
            filled
            @click="onOpenClick"
        />
        <Transition :name="$style['media-viewer']">
            <VMediaViewer v-if="isOpen" />
        </Transition>
    </NuxtStory>
</template>

<style lang="scss" module>
.media-viewer {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition: translate 1s ease(out-quart);
    }
    &:global(#{'-enter-from'}),
    &:global(#{'-leave-to'}) {
        translate: 0 100%;
    }
}

.controls {
    position: fixed;
    z-index: 2000;
}
</style>
