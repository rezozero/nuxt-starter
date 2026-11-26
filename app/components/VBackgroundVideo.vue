<script lang="ts" setup>
import type { PropType } from 'vue'
import { getEmbedSrc } from '~/utils/embed'
import { videoSources } from '~/utils/video/video-props'

// A muted looping video without controls, played natively or through a YouTube / Vimeo
// embed driven by postMessage: no player library nor the platform SDKs, since nothing of their
// UI would show.
const props = defineProps({
    // Native only: an embed has a single player URL.
    ...videoSources,
    embedPlatform: String,
    embedId: String,
    // Accessible name of the embed <iframe> (RGAA 2.1).
    title: String,
    width: [Number, String],
    height: [Number, String],
    // The box is sized by the thumbnail, whose crop rarely matches the video ratio.
    fit: { type: String as PropType<'cover' | 'contain'>, default: 'cover' },
    showSpinner: { type: Boolean, default: true },
})

const emit = defineEmits<{
    ready: []
    playing: []
    pause: []
}>()

function getUrl(src?: string): string | undefined {
    return src && !src.startsWith('http') && !src.startsWith('/') ? useRoadizDocumentUrl(src) : src
}

const isEmbed = computed(() => !!props.embedPlatform && !!props.embedId)

// An embed <iframe> needs a name of its own (RGAA 2.1), hidden from assistive technologies
// or not: the document title when the CMS has one, a generic label otherwise.
const { t } = useI18n()
const iframeTitle = computed(() => props.title || t('video_player.iframe_title'))

// Native video
const nativeSources = computed(() => {
    if (isEmbed.value) return []

    return (props.sources || []).map(source => ({ ...source, src: getUrl(source.src) }))
})

const video = ref<HTMLVideoElement>()

onMounted(() => {
    if (!video.value) return

    emit('ready')

    // The `autoplay` attribute may have started it before hydration, its event unheard.
    if (!video.value.paused) onPlaying()
})

// Neither the video file nor the embed player loads before the box nears the viewport.
const wrapper = ref<HTMLElement>()
const isNearViewport = ref(false)
const { stop: stopObserver } = useIntersectionObserver(
    () => isEmbed.value ? wrapper.value : video.value,
    ([entry]) => {
        if (!entry?.isIntersecting) return
        isNearViewport.value = true
        stopObserver()
    },
    { rootMargin: '200px' },
)

// Decoration, never the LCP: it waits for the page load, and stays on the thumbnail when the
// visitor asks for less data.
const isPageLoaded = ref(false)

onMounted(() => {
    if (document.readyState === 'complete') isPageLoaded.value = true
    else window.addEventListener('load', () => (isPageLoaded.value = true), { once: true })
})

const shouldLoad = computed(() =>
    isNearViewport.value
    && isPageLoaded.value
    && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

// Sources appended after the first render are only picked up on load().
watch(shouldLoad, async () => {
    await nextTick()
    video.value?.load()
})

// The `media` of a source is only read on load(), never on a viewport change: a phone turned
// past the breakpoint would keep the video picked for the other orientation.
const matchedMedia = ref<string>()

watchEffect((onCleanup) => {
    const medias = [...new Set(nativeSources.value.flatMap(({ media }) => media ? [media] : []))]
    if (!import.meta.client || !medias.length) return

    const queries = medias.map(media => window.matchMedia(media))
    const update = () => (matchedMedia.value = queries.find(query => query.matches)?.media)

    update()
    queries.forEach(query => query.addEventListener('change', update))
    onCleanup(() => queries.forEach(query => query.removeEventListener('change', update)))
})

// Paused through `pause()`, by the visitor or out of sight: the `autoplay` of a reload must not
// resume it, the source is picked again on the next `play()`.
let isHeld = false
let isSourceOutdated = false

watch(matchedMedia, () => {
    if (!shouldLoad.value) return

    if (isHeld) isSourceOutdated = true
    else video.value?.load()
})

// Embed
const isMdUp = useMinWidth('md')

const embedSrc = computed(() => {
    if (!isEmbed.value) return undefined

    const id = props.embedId as string
    let params: Record<string, string> = {}

    if (props.embedPlatform === 'youtube') {
        params = {
            autoplay: '1',
            mute: '1',
            loop: '1',
            // YouTube only loops a playlist
            playlist: id,
            controls: '0',
            disablekb: '1',
            fs: '0',
            playsinline: '1',
            rel: '0',
            iv_load_policy: '3',
            enablejsapi: '1',
        }
    }
    else if (props.embedPlatform === 'vimeo') {
        params = {
            // Hides the player UI, on a Plus plan or above only: the parameters below still
            // apply without it.
            background: '1',
            autoplay: '1',
            muted: '1',
            loop: '1',
            autopause: '0',
            playsinline: '1',
            title: '0',
            byline: '0',
            portrait: '0',
            // Do Not Track (GDPR: no Vimeo cookies nor third-party analytics)
            dnt: '1',
            // Caps the adaptive stream on small screens, on a Plus plan or above only. Not lower: in
            // cover, the portrait crop shows a narrow band of the frame, upscaled until 540p blurs.
            ...(!isMdUp.value && { quality: '720p' }),
        }
    }

    return getEmbedSrc(id, props.embedPlatform as string, params)
})

const iframe = ref<HTMLIFrameElement>()
const {
    isReady: isEmbedReady,
    isPlaying: isEmbedPlaying,
    videoRatio: embedVideoRatio,
    play: playEmbed,
    pause: pauseEmbed,
} = useEmbedPlayer(iframe, () => props.embedPlatform)

watch(isEmbedReady, ready => ready && emit('ready'))
watch(isEmbedPlaying, (playing) => {
    if (playing) onPlaying()
    else emit('pause')
})

// An iframe has no `object-fit`: to cover its bounds, its box is sized past them.
const boundsSize = ref<[number, number]>()

// Measure the box to cover, not the one being sized: that one carries the size of the
// previous pass.
useResizeObserver(
    () => isEmbed.value && props.fit === 'cover' ? wrapper.value?.parentElement : undefined,
    // Taken from the entry: reading `clientWidth` here forces a layout.
    ([entry]) => {
        if (entry) boundsSize.value = [entry.contentRect.width, entry.contentRect.height]
    },
)

const coverSize = computed<[number, number] | undefined>(() => {
    if (!boundsSize.value) return undefined

    // The player's own ratio once it gives it: the document's dimensions are its thumbnail's
    // (2500 × 1397 for a 16:9 video), a gap that leaves bare strips along the edges as the
    // box grows.
    const ratio = embedVideoRatio.value || Number(props.width) / Number(props.height) || 16 / 9

    const width = boundsSize.value[0] + 2 // + 2 for hiding a potential antialiasing issue
    const height = boundsSize.value[1] + 2

    // Bounds taller than the video match its height and overflow its width, flatter ones
    // the other way round.
    return width / height < ratio ? [height * ratio, height] : [width, width / ratio]
})

const coverStyle = computed(() => {
    if (!coverSize.value) return undefined

    return {
        width: `${coverSize.value[0]}px`,
        height: `${coverSize.value[1]}px`,
    }
})

function isPlaying() {
    return isEmbed.value ? isEmbedPlaying.value : !!video.value && !video.value.paused
}

function play() {
    isHeld = false

    if (isEmbed.value) return playEmbed()

    if (isSourceOutdated) {
        isSourceOutdated = false
        video.value?.load()
    }
    video.value?.play().catch(() => {})
}

function pause() {
    isHeld = true

    if (isEmbed.value) pauseEmbed()
    else video.value?.pause()
}

// Out of sight — scrolled away or in a hidden tab — the video pauses, so that it stops spending
// CPU and bandwidth for nothing. Only a pause of its own resumes on the way back, never the user's.
// Assumed in view until the observer says otherwise: a video already playing at hydration is not
// paused for the frame it takes to report.
const isInView = useElementVisibility(() => isEmbed.value ? wrapper.value : video.value, { initialValue: true })
const documentVisibility = useDocumentVisibility()
const isVisible = computed(() => isInView.value && documentVisibility.value === 'visible')
let isAutoPaused = false

function autoPause() {
    isAutoPaused = true
    pause()
}

watch(isVisible, (visible) => {
    if (!visible && isPlaying()) {
        autoPause()
    }
    else if (visible && isAutoPaused) {
        isAutoPaused = false
        play()
    }
})

// Autoplay may start it out of sight: loaded near the viewport, or in a background tab.
function onPlaying() {
    if (!isVisible.value) autoPause()
    emit('playing')
}

// A play or a pause asked from outside is the user's: an automatic pause no longer resumes.
defineExpose({
    play: () => {
        isAutoPaused = false
        play()
    },
    pause: () => {
        isAutoPaused = false
        pause()
    },
    toggle: () => {
        isAutoPaused = false
        if (isPlaying()) pause()
        else play()
    },
})
</script>

<template>
    <div
        v-if="isEmbed"
        ref="wrapper"
        :class="[$style.wrapper, coverStyle && $style['wrapper--cover']]"
        :style="coverStyle"
    >
        <template v-if="shouldLoad">
            <iframe
                ref="iframe"
                :src="embedSrc"
                :title="iframeTitle"
                loading="lazy"
                allow="autoplay; encrypted-media"
                tabindex="-1"
                aria-hidden="true"
                :class="$style.media"
            />
            <VSpinner
                v-if="showSpinner && !isEmbedReady"
                :class="$style.spinner"
            />
        </template>
    </div>
    <video
        v-else
        ref="video"
        :width="width"
        :height="height"
        autoplay
        muted
        loop
        playsinline
        :preload="shouldLoad ? 'auto' : 'none'"
        :class="[$style.media, $style.video, props.fit === 'contain' && $style['video--contain']]"
        @playing="onPlaying"
        @pause="emit('pause')"
    >
        <template v-if="shouldLoad">
            <source
                v-for="source in nativeSources"
                :key="source.src"
                :src="source.src"
                :type="source.type"
                :media="source.media"
            >
        </template>
    </video>
</template>

<style lang="scss" module>
// Laid over the box of the parent, sized by something else — the thumbnail in
// `VRoadizVideo`.
.wrapper {
    // the spinner z-index is relative to this wrapper
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    isolation: isolate;

    // Centred, the box spreads its overflow on both sides instead of cropping the right
    // and the bottom only.
    &--cover {
        inset: 50% auto auto 50%;
        translate: -50% -50%;
    }
}

.media {
    position: var(--v-background-video-media-position);
    display: block;
    width: var(--v-background-video-media-width, 100%);
    height: var(--v-background-video-media-height, 100%);
    border: 0;
    object-fit: var(--v-background-video-media-object-fit, cover);

    // decoration: no click pauses it nor reveals the embed UI
    pointer-events: none;
}

// laid over the box of the parent, as the embed wrapper
.video {
    position: absolute;
    inset: 0;

    &--contain {
        object-fit: contain;
    }
}

.spinner {
    position: absolute;
    z-index: 10;
    top: calc(50% - #{px-to-rem(35)});
    left: calc(50% - #{px-to-rem(35)});
    width: px-to-rem(70);
    height: px-to-rem(70);
}
</style>
