<script lang="ts" setup>
import type { RoadizDocument } from '@roadiz/types'
import type { PropType } from 'vue'
import pick from 'lodash/pick'
import type { VBackgroundVideo, VVideoPlayer } from '#components'
import { isImage } from '~/utils/roadiz/document'
import { commonVideoProps, videoAttributes, videoSrc } from '~/utils/video/video-props'
import { getVideoAttrsValues } from '~/utils/video/video-attributes'

const props = defineProps({
    ...commonVideoProps,
    ...videoAttributes,
    document: { type: Object as PropType<RoadizDocument>, required: true },
    thumbnail: { type: Object as PropType<RoadizDocument> },
    hideThumbnail: Boolean,
    // Called instead of playing inline when the thumbnail is clicked (e.g. to open a media viewer)
    onRequestPlay: Function as PropType<() => void>,
    // Mounts the inline player behind the thumbnail, so that a click plays it right away
    preload: Boolean,
    // Preloads the thumbnail a background video shows until its first frame: as a header, it is the LCP.
    thumbnailPreload: { type: [Boolean, Object] as PropType<boolean | { fetchPriority: 'auto' | 'high' | 'low' }> },
    showSpinner: { type: Boolean, default: true },
})

// BACKGROUND
const backgroundPlayer = ref<InstanceType<typeof VBackgroundVideo>>()
const isBackgroundPlayerReady = ref(false)
const isBackgroundPlaying = ref(false)

// `playing` fires once the first frame is painted: from then on, the thumbnail
// can go without leaving a black screen.
const videoHasPlayed = ref(false)

function onBackgroundPlayerPlaying() {
    isBackgroundPlaying.value = true
    videoHasPlayed.value = true
}

// INLINE
const inlinePlayer = ref<InstanceType<typeof VVideoPlayer>>()
const hadInteraction = ref(false)

// A play asked before the player is ready, replayed on `ready` unless a pause came in
// between: a media viewer slide left before its video loaded must not play out of sight.
let isPlayPending = false

function requestInlinePlay() {
    hadInteraction.value = true
    isPlayPending = true
}

function onInlinePlayerReady() {
    // play() may have been called before the player finished loading
    if (isPlayPending) inlinePlayer.value?.play()
}

function onClick(event: Event) {
    if (event?.defaultPrevented) return

    if (props.onRequestPlay) {
        props.onRequestPlay()
        return
    }

    if (!props.playsinline) return

    requestInlinePlay()

    // Player already mounted: play within the user gesture
    if (props.preload) inlinePlayer.value?.play()
}

defineExpose({
    play: () => {
        if (props.background) {
            backgroundPlayer.value?.play()
        }
        else {
            requestInlinePlay()
            // A mounted player plays right away, a new one once its media is ready (`ready` event)
            inlinePlayer.value?.play()
        }
    },
    pause: () => {
        if (props.background) {
            backgroundPlayer.value?.pause()
        }
        else {
            isPlayPending = false
            inlinePlayer.value?.pause()
        }
    },
    toggle: () => {
        if (props.background) backgroundPlayer.value?.toggle()
        else inlinePlayer.value?.toggle()
    },
})

const displayedThumbnail = computed(() => {
    const documents = [props.thumbnail, props.document?.thumbnail, props.document]
    return documents.find(document => isImage(document))
})

const filteredVideoProps = computed(() =>
    pick(props, Object.keys({ ...commonVideoProps, ...videoAttributes, ...videoSrc })))

const dimension = computed(() => {
    return {
        width: props.document.imageWidth,
        height: props.document.imageHeight,
    }
})

const videoRatio = computed(() => {
    return Number(dimension.value.width) / Number(dimension.value.height)
})

const embedVideoAttrs = computed(() => {
    return {
        embedPlatform: props.document.embedPlatform,
        embedId: props.document.embedId,
        title: props.document.name,
        src: props.document.relativePath,
        altSources: props.document.altSources,
        mimeType: props.document.mimeType,
        ...dimension.value,
        ...getVideoAttrsValues(props, !!props?.background),
        ...filteredVideoProps.value,
    }
})

// A generic "watch the video" is not enough when several videos share a page (RGAA 6.1):
// the accessible name keeps the visible label and adds the document name.
const { t } = useI18n()
const playButtonLabel = computed(() => props.document.name ? t('watch_the_video_title', { title: props.document.name }) : undefined)
</script>

<template>
    <div
        v-if="props.background"
        :class="$style['background-root']"
        :style="!displayedThumbnail && { aspectRatio: videoRatio || 16 / 9 }"
    >
        <VBackgroundVideo
            ref="backgroundPlayer"
            :embed-platform="props.document.embedPlatform"
            :embed-id="props.document.embedId"
            :title="props.document.name"
            :src="props.document.relativePath"
            :alt-sources="props.document.altSources"
            :mime-type="props.document.mimeType"
            v-bind="dimension"
            :fit="props.fit"
            :show-spinner="props.showSpinner"
            @ready="isBackgroundPlayerReady = true"
            @playing="onBackgroundPlayerPlaying"
            @pause="isBackgroundPlaying = false"
        />
        <!-- Gives the block its size, as an image would — with the crops of the slotted sources —
             and the player covers it. Shown until the first frame is painted, then hidden but
             still in the flow, so nothing moves.
             The `v-if` belongs on the `<template>`: an empty slot would still make `VRoadizImage`
             render a `<picture>` around no source at all. -->
        <VRoadizImage
            v-if="displayedThumbnail"
            :document="displayedThumbnail"
            alt=""
            loading="eager"
            :preload="props.thumbnailPreload"
            :class="[$style['background-thumbnail'], videoHasPlayed && $style['background-thumbnail--hidden']]"
        >
            <template
                v-if="$slots.default"
                #default
            >
                <slot />
            </template>
        </VRoadizImage>
        <!-- A moving content that lasts needs a way to stop it (RGAA 13.8) -->
        <VButton
            v-if="isBackgroundPlayerReady"
            :aria-label="isBackgroundPlaying ? $t('pause') : $t('play')"
            theme="dark"
            :icon-name="isBackgroundPlaying ? 'player-pause' : 'player-play'"
            :class="$style['background-button']"
            @click="backgroundPlayer?.toggle()"
        />
    </div>
    <VVideoPlayer
        v-else-if="hideThumbnail"
        ref="inlinePlayer"
        v-bind="embedVideoAttrs"
        :show-spinner="props.showSpinner"
        @ready="onInlinePlayerReady"
    />
    <div
        v-else
        :class="[$style.root, hadInteraction && $style['root--had-interaction']]"
    >
        <VButton
            :label="$t('watch_the_video')"
            :aria-label="playButtonLabel"
            theme="dark"
            icon-name="player-play"
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
        <div
            v-if="preload || hadInteraction"
            :class="[$style['player-wrapper'], preload && !hadInteraction && $style['player-wrapper--hidden']]"
        >
            <VVideoPlayer
                ref="inlinePlayer"
                v-bind="embedVideoAttrs"
                :autoplay="hadInteraction && !preload"
                :show-spinner="props.showSpinner"
                @ready="onInlinePlayerReady"
            />
        </div>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/components/v-button';

.root {
    --v-video-player-position: absolute;
    --v-video-player-height: 100%;
    --v-video-player-width: 100%;

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

    @include v-button.size('md');

    @include media('>=lg') {
        @include v-button.size('lg');
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
        background-color: rgb(246 246 246);
    }
}

.player-wrapper {
    position: absolute;
    inset: 0;

    &--hidden {
        pointer-events: none;
        visibility: hidden;
    }
}

// A container that imposes its own box gets it filled; one that leaves the height to
// the media — a percentage of an `auto` height resolves to `auto` — gets the height of
// the thumbnail, or of the video ratio without one. The cover sizing of
// `VBackgroundVideo` measures this box.
.background-root {
    position: relative;

    // clips the embed, sized past the box to cover it
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.background-thumbnail {
    // `VImg` sets its own height from this one, whichever of the two rules wins
    --v-img-height: 100%;

    // above the player, which is positioned
    position: relative;
    z-index: 1;

    // the class lands on the `<img>` itself when no source is slotted, on its `<picture>` otherwise
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transition:
        opacity 0.4s,
        visibility 0s 0.4s;

    &--hidden {
        opacity: 0;
        visibility: hidden;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}

.background-button {
    position: absolute;
    z-index: 2;
    top: var(--v-roadiz-video-background-button-top, #{px-to-rem(16)});
    right: var(--v-roadiz-video-background-button-right, #{px-to-rem(16)});

    // Hidden until the video is hovered, only where hovering exists: on touch
    // screens it stays visible, and the keyboard reveals it on focus.
    @media (hover: hover) {
        opacity: 0;
        transition: opacity 0.2s;

        .background-root:hover &,
        &:focus-visible {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}
</style>
