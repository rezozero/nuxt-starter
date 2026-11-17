<script lang="ts" setup>
import { commonVideoProps, embedVideoProps, videoAttributes, videoSrc } from '~/utils/video/video-props'
import { getVideoAttrsValues } from '~/utils/video/video-attributes'
import { getEmbedSrc } from '~/utils/embed'

const props = defineProps({
    ...videoSrc,
    ...videoAttributes,
    ...embedVideoProps,
    ...commonVideoProps,
    showSpinner: { type: Boolean, default: true },
})

// Sources
function getUrl(src?: string): string | undefined {
    return src && !src.startsWith('http') && !src.startsWith('/') ? useRoadizDocumentUrl(src) : src
}

const isEmbed = computed(() => !!props.embedPlatform && !!props.embedId)

// Video.js media element playing the embed, if the platform has one
const embedTag = computed(() => {
    if (!isEmbed.value) return undefined

    if (props.embedPlatform === 'youtube') return 'youtube-video'
    if (props.embedPlatform === 'vimeo') return 'vimeo-video'

    return undefined
})

// An embed <iframe> needs a name of its own (RGAA 2.1): the document title when
// the CMS has one, a generic label otherwise.
const { t } = useI18n()
const iframeTitle = computed(() => props.title || t('video_player.iframe_title'))

const src = computed(() => {
    if (isEmbed.value) return getEmbedSrc(props.embedId as string, props.embedPlatform as string)
    else return getUrl(props.src)
})

// The media element builds the embed URL from this source: YouTube parameters and Vimeo
// options go under `engine`, spelled as each platform spells them. Set as the element's `source`
// in `setupEmbed()`, never as a `src` attribute: that would load a first Vimeo iframe without `dnt`.
const embedSource = computed(() => {
    if (props.embedPlatform === 'youtube') {
        return { src: src.value, engine: { youtube: { ...props.youtube } } }
    }
    if (props.embedPlatform === 'vimeo') {
        // Do Not Track (GDPR: no Vimeo cookies nor third-party analytics): Vimeo plays without
        // consent on this condition alone, so the CMS cannot turn it off.
        return { src: src.value, engine: { vimeo: { ...props.vimeo, dnt: true } } }
    }

    return undefined
})

// Native video
const videoSources = computed(() => {
    if (isEmbed.value) return []

    const altSources = (props.altSources || [])
        .filter(file => !!file.relativePath)
        .map((file) => {
            return {
                src: getUrl(String(file.relativePath)),
                type: String(file.mimeType),
            }
        })
    return [{ src: src.value, type: props.mimeType || 'video/mp4' }, ...altSources]
})

// Attributes
const videoAttrsValue = computed(() => getVideoAttrsValues(props, props.background))

// Never `controls`: the native controls would show under the Video.js ones. A false boolean
// is left out rather than bound, since a custom element not upgraded yet would get it as an
// attribute — and any `playsinline="false"` attribute reads as true.
const mediaAttrs = computed(() => {
    return {
        playsinline: videoAttrsValue.value.playsinline || undefined,
        muted: videoAttrsValue.value.muted || undefined,
        loop: videoAttrsValue.value.loop || undefined,
        autoplay: videoAttrsValue.value.autoplay || undefined,
    }
})

const videoAttrs = computed(() => {
    return {
        width: props.width,
        height: props.height,
        ...mediaAttrs.value,
    }
})

const controls = computed(() => videoAttrsValue.value.controls)

// PLAYER
const media = ref<HTMLMediaElement | null>(null)
const container = ref<HTMLElement | null>(null)
const { isFallbackFullscreen, install: installFallbackFullscreen } = useFallbackFullscreen(container)
const videoReady = ref(false)
const emits = defineEmits(['ready'])

// Video.js draws the embed <iframe> in the shadow root of its media element, without any
// `title` (RGAA 2.1). Kept in place: the YouTube IFrame API replaces it, once ready, with the
// title of the video on YouTube.
let iframeTitleObserver: MutationObserver | null = null

function setIframeTitle() {
    const iframe = media.value?.shadowRoot?.querySelector('iframe')
    if (!iframe) return

    if (iframe.getAttribute('title') !== iframeTitle.value) iframe.setAttribute('title', iframeTitle.value)

    iframeTitleObserver?.disconnect()
    iframeTitleObserver = new MutationObserver(setIframeTitle)
    iframeTitleObserver.observe(iframe, { attributes: true, attributeFilter: ['title'] })
}

onBeforeUnmount(() => iframeTitleObserver?.disconnect())

function onLoadedMetadata() {
    if (videoReady.value) return

    videoReady.value = true
    emits('ready')
}

// Waits for the element to be defined. Assigned before, `source` stays a property of the
// element's own, hiding the one Video.js defines (still in 10.3.0: unlike its UI elements, its
// media elements never take over such a property on upgrade), and the embed never loads.
async function setupEmbed() {
    if (!embedTag.value || !media.value) return

    await customElements.whenDefined(embedTag.value)

    const element = media.value as HTMLMediaElement & { source?: typeof embedSource.value }
    if (element.source !== embedSource.value) element.source = embedSource.value

    installFallbackFullscreen(element)
    setIframeTitle()
}

watch([media, embedSource, iframeTitle], setupEmbed)

onMounted(async () => {
    // In this order: an embed media asks for its `<video-player>` once, on connection (context
    // protocol). Defined first, it asks before the player can answer, and its controls stay dead.
    await import('~/utils/video/define-player-elements')

    if (embedTag.value === 'youtube-video') await import('@videojs/html/media/youtube-video')
    else if (embedTag.value === 'vimeo-video') await import('@videojs/html/media/vimeo-video')

    // A native video may have loaded its metadata before the listener was bound (SSR)
    if (media.value && !isEmbed.value && media.value.readyState >= 1) onLoadedMetadata()
})

// Controls driven by `VRoadizVideo` through its template ref. Before the media is ready
// they do nothing: the parent replays on the `ready` event. A YouTube player asked to play
// while it loads its source stays stuck buffering (Video.js 10.2.0), and asked to pause, it
// throws (`pauseVideo` is not a function until the IFrame API is ready). Both happen as soon
// as the element is already defined, from the second player on. A rejected play()
// (autoplay policy) leaves the video paused, which its controls already show.
function play() {
    if (!videoReady.value) return

    media.value?.play?.()?.catch(() => {})
}

function pause() {
    if (!videoReady.value) return

    media.value?.pause?.()
}

defineExpose({
    play,
    pause,
    toggle: () => media.value?.paused ? play() : pause(),
})
</script>

<template>
    <!-- A platform Video.js has no media element for plays in its own player -->
    <div
        v-if="isEmbed && !embedTag"
        :class="[$style.root, $style['root--embed']]"
    >
        <iframe
            :src="src"
            :title="iframeTitle"
            frameborder="0"
            allow="autoplay"
            :class="$style.media"
        />
    </div>
    <!-- The root box, so that a class set on the component sizes the player -->
    <media-i18n
        v-else
        :class="[$style.root, isEmbed && $style['root--embed']]"
    >
        <video-player :class="$style.provider">
            <media-container
                ref="container"
                :class="[$style.container, isFallbackFullscreen && $style['container--fallback-fullscreen']]"
            >
                <youtube-video
                    v-if="embedTag === 'youtube-video'"
                    ref="media"
                    v-bind="mediaAttrs"
                    :class="$style.media"
                    @loadedmetadata="onLoadedMetadata"
                />
                <vimeo-video
                    v-else-if="embedTag === 'vimeo-video'"
                    ref="media"
                    v-bind="mediaAttrs"
                    :class="$style.media"
                    @loadedmetadata="onLoadedMetadata"
                />
                <video
                    v-else
                    ref="media"
                    v-bind="videoAttrs"
                    :class="$style.media"
                    @loadedmetadata="onLoadedMetadata"
                >
                    <source
                        v-for="source in videoSources"
                        :key="source.src"
                        :src="source.src"
                        :type="source.type"
                    >
                </video>
                <VSpinner
                    v-if="showSpinner && isEmbed && !videoReady"
                    :class="$style.spinner"
                />
                <template v-if="controls">
                    <VPlayerControls />
                    <media-hotkey
                        keys="Space"
                        action="togglePaused"
                    />
                    <media-hotkey
                        keys="k"
                        action="togglePaused"
                    />
                    <media-hotkey
                        keys="m"
                        action="toggleMuted"
                    />
                    <media-hotkey
                        keys="f"
                        action="toggleFullscreen"
                    />
                    <media-hotkey
                        keys="ArrowLeft"
                        action="seekStep"
                        value="-10"
                    />
                    <media-hotkey
                        keys="ArrowRight"
                        action="seekStep"
                        value="10"
                    />
                    <!-- Click to play, and on touch screens a tap that shows the controls -->
                    <media-gesture
                        type="tap"
                        action="togglePaused"
                        pointer="mouse"
                    />
                    <media-gesture
                        type="tap"
                        action="toggleControls"
                        pointer="touch"
                    />
                </template>
            </media-container>
        </video-player>
    </media-i18n>
</template>

<style lang="scss" module>
// Under `:where()`, so that a class set on the component wins whatever the stylesheet order
:where(.root) {
    position: var(--v-video-player-position, relative);
    display: block;
    width: var(--v-video-player-width, 100%);
    height: var(--v-video-player-height, auto);
}

// Only when the parent leaves the height to the player
:where(.root--embed) {
    aspect-ratio: 16 / 9;
}

// Video.js leaves its own elements inline unless its `global.css` is loaded
.provider {
    display: contents;
}

.container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    isolation: isolate;

    // Also resets the user agent style of a `[popover]` (`useFallbackFullscreen`)
    &--fallback-fullscreen {
        position: fixed;
        z-index: var(--v-video-player-fallback-fullscreen-z-index, 1000);
        overflow: hidden;
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        padding: 0;
        border: 0;
        margin: 0;
        background-color: rgb(0 0 0);
        inset: 0;
    }
}

.media {
    display: block;
    width: 100%;
    height: 100%;

    // `contain` is the default of a <video>, an unset custom property would make it `fill`
    object-fit: var(--v-video-player-object-fit, contain);
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
