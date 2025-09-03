<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import image from '~/assets/stories/fixtures/documents/image-01.json'
import imagePortrait from '~/assets/stories/fixtures/documents/image-portrait.json'
import video from '~/assets/stories/fixtures/documents/video-01.json'
import { useMediaViewer } from '~/composables/use-media-viewer'

const imageWithLongDesc = {
    ...image,
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore possimus quaerat non nesciunt perspiciatis. Cumque officia sequi consequatur corrupti nihil id quisquam similique asperiores quia dolorem aut voluptatibus ducimus aspernatur, voluptas mollitia expedita. Ullam tenetur labore assumenda at? Porro, neque? Temporibus, voluptates incidunt quam, dolorum quos a consequatur id, enim veniam perferendis impedit suscipit. Nulla dignissimos corrupti similique voluptate quae molestiae iure itaque, velit maxime officiis ut a nobis iusto est! Veniam quas, dolorem quod harum dolore id, blanditiis officia accusamus dolor corrupti, quisquam optio eos ex maiores totam? Voluptatum quaerat sit hic rem quo molestiae eaque, modi asperiores velit.',
}

const documents = [image, imageWithLongDesc, imagePortrait, video, image, video, image] as RoadizDocument[]
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
