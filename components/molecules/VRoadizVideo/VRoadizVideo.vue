<script lang="ts" setup>
import type { RoadizDocument } from '@roadiz/types'
import type { PropType } from 'vue'
import { isImage } from '~/utils/roadiz/document'
import { commonVideoProps, videoAttributes, videoSrc } from '~/utils/video/video-props'
import { getVideoAttrsValues } from '~/utils/video/video-attributes'

const props = defineProps({
    ...commonVideoProps,
    ...videoAttributes,
    document: { type: Object as PropType<RoadizDocument>, required: true },
    thumbnail: { type: Object as PropType<RoadizDocument> },
    hideThumbnail: Boolean,
})

const hadInteraction = ref(false)
const onClick = (event: Event) => {
    if (event.defaultPrevented || !props.playsinline) return

    hadInteraction.value = true
}
const onVideoEnded = () => (hadInteraction.value = false)

const displayedThumbnail = computed(() => {
    const documents = [props.thumbnail, props.document?.thumbnail, props.document]
    return documents.find(document => isImage(document))
})

const filteredVideoProps = computed(() => {
    return Object.keys(props).reduce((acc, key) => {
        // @ts-expect-error TODO: use pick() here
        if (commonVideoProps[key] || videoAttributes[key] || videoSrc[key]) acc[key] = props[key]
        return acc
    }, {})
})

const dimension = computed(() => {
    return {
        width: props.document.imageWidth,
        height: props.document.imageHeight,
    }
})

const videoRatio = computed(() => {
    const ratio = Number(dimension.value.width) / Number(dimension.value.height)
    if (typeof ratio === 'number') return ratio
})

const embedVideoAttrs = computed(() => {
    return {
        embedPlatform: props.document.embedPlatform,
        embedId: props.document.embedId,
        src: props.document.relativePath,
        altSources: props.document.altSources,
        ...dimension.value,
        ...getVideoAttrsValues(props, !!props?.background),
        ...filteredVideoProps.value,
    }
})
</script>

<template>
    <VVideoPlayer
        v-if="hideThumbnail || props.background"
        v-bind="embedVideoAttrs"
    />
    <div
        v-else
        :class="[$style.root, hadInteraction && $style['root--had-interaction']]"
    >
        <VButton
            :label="$t('watch_the_video')"
            theme="dark"
            icon-name="play"
            filled
            :class="$style.button"
            @click="onClick"
        />
        <slot>
            <VRoadizImage
                v-if="displayedThumbnail"
                :document="displayedThumbnail"
                :class="$style.thumbnail"
                @click="onClick"
            />
            <div
                v-else
                :class="[$style.thumbnail, $style['thumbnail--placeholder']]"
                :style="{ aspectRatio: videoRatio || 16 / 9 }"
            />
        </slot>
        <VVideoPlayer
            v-if="hadInteraction"
            v-bind="embedVideoAttrs"
            :autoplay="true"
            :plyr="{ listener: { ended: onVideoEnded } }"
        />
    </div>
</template>

<style lang="scss" module="">
.root {
    --v-player-position: absolute;
    --v-player-height: 100%;
    --v-player-width: 100%;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.button {
    --v-button-position: absolute;

    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @include v-button-size('m');

    @include media('>=lg') {
        @include v-button-size('l');
    }

    .root--had-interaction & {
        pointer-events: none;
        visibility: hidden;
    }
}

.thumbnail {
    width: 100%;
    cursor: pointer;

    .root--had-interaction & {
        pointer-events: none;
        visibility: hidden;
    }

    &--placeholder {
        aspect-ratio: 16 / 9;
        background-color: color(grey-50);
    }
}
</style>
