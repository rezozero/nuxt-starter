<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { DragGesture } from '~/utils/events/drag-gesture'
import { isImage, isVideo } from '~/utils/roadiz/document'
import { isTouchDevice } from '~/utils/browser/is-touch'
import type { VNativeCarousel } from '#components'
import { useIsMinWidth } from '~/composables/use-is-min-width'
import { styles } from '~/composables/styles'

const { t } = useI18n()
// Refs
const root = ref<HTMLDialogElement | null>(null)
const carouselItemEls: (HTMLElement | null)[] = []
const setCarouselItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
    carouselItemEls[index] = el as HTMLElement | null
    if (index === currentIndex.value) zoomTarget.value = (el as HTMLElement | null)
}
type PlayableMediaRef = { play?: () => void, pause?: () => void }
const mediaRefs: (PlayableMediaRef | null)[] = []
const setMediaRef = (el: ComponentPublicInstance | Element | null, index: number) => {
    mediaRefs[index] = el as PlayableMediaRef | null
}

const { documents, slideIndex, close: closeMediaViewer } = useMediaViewer()

// attach carousel methods
const carouselRef = ref<InstanceType<typeof VNativeCarousel> | null>(null)

// Index of the current item
const currentIndex = computed(() => carouselRef.value?.currentIndex ?? 0)

// Current document based on the current index
const currentDocument = computed(() => {
    const index = currentIndex.value
    return documents.value?.[index]
})

// Stable ids for the details text blocks, referenced by the active media's
// aria-describedby so screen readers announce the description on focus.
const descriptionId = useId()
const copyrightId = useId()
const externalUrlId = useId()

const detailsDescribedBy = computed(() => {
    if (!currentDocument.value) return undefined
    const ids: string[] = []
    if (currentDocument.value.description) ids.push(descriptionId)
    if (currentDocument.value.copyright) ids.push(copyrightId)
    if (currentDocument.value.externalUrl) ids.push(externalUrlId)
    return ids.length ? ids.join(' ') : undefined
})

// Determine if the current media is an image or not
const isCurrentMediaVideoType = computed(() => isVideo(currentDocument.value))
const currentMediaIsImageType = computed(() => isImage(currentDocument.value) && !isCurrentMediaVideoType.value)

// Determine if we are in single media mode or not
const isSingleMedia = computed(() => (documents.value?.length ?? 0) <= 1)

// Listen keyboard events
useEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeMediaViewer()
    if (isSingleMedia.value) return
    if (event.key === 'ArrowLeft') carouselRef.value?.triggerPrev()
    if (event.key === 'ArrowRight') carouselRef.value?.triggerNext()
})

// on route change, close the media viewer
const route = useRoute()
watch(route, () => {
    closeMediaViewer()
})

// Focus + Open the dialog on mount with the current Media index
onMounted(async () => {
    root.value?.showModal()
    root.value?.focus()
    if (!isSingleMedia.value && slideIndex.value > 0) {
        carouselRef.value?.scrollToIndex(slideIndex.value, 'instant')
    }

    // wait a frame to ensure the media are rendered
    await nextTick()
    const initialIndex = isSingleMedia.value ? 0 : (slideIndex.value || 0)
    // autoplay the media if it's a video (skip on touch devices — autoplay is unreliable on iOS)
    if (!isTouchDevice() && isVideo(documents.value?.[initialIndex])) {
        mediaRefs[initialIndex]?.play?.()
    }
})
onBeforeUnmount(() => root.value?.close())

// Zoom logic
const zoomTarget = shallowRef<HTMLElement | null>(null)
const {
    scale, style: zoomStyle, handleZoomIn, handleZoomOut, resetZoom, handleDblClick,
    isAtMin: zoomAtMin, isAtMax: zoomAtMax,
} = useMediaZoom(zoomTarget)

watch(currentIndex, (newIndex, oldIndex) => {
    // pause the old media if it was a video
    mediaRefs[oldIndex]?.pause?.()

    const el = carouselItemEls[newIndex]
    if (!el) return
    // Don't want zoom for other media type than image
    zoomTarget.value = currentMediaIsImageType.value ? el : null
    // and need to reset zoom when switching media
    resetZoom()
})

// Determine when the carousel is enabled or not
const carouselEnabled = computed(() => scale.value <= 1)

// --------------------------------------------------------- DRAG MEDIA TO CLOSE

const useIsMinWidthLg = useIsMinWidth('lg')

let gesture: DragGesture | null = null

let distanceY = 0
const quiteDistance = 150
const initGesture = () => {
    const element = carouselItemEls[currentIndex.value]
    if (!element) return

    gesture = new DragGesture(element, {
        axis: 'y',
        onStart() {
            distanceY = 0
            styles(element, { transition: 'none' })
        },
        onMove({ distance: [_, dy] }) {
            distanceY = dy
            styles(element, {
                y: distanceY,
                opacity: Math.max(0, 1 - Math.abs(distanceY) / 300),
            })
        },
        onEnd({ distance: [_, dy] }) {
            if (Math.abs(dy) > quiteDistance) {
                closeMediaViewer()
            }
            else {
                styles(element, {
                    y: 0,
                    opacity: 1,
                    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                })
                setTimeout(() => styles(element, { transition: 'none', transform: 'none' }), 300)
            }
        },
    })
}

const destroyGesture = () => {
    gesture?.destroy()
    gesture = null
}

onMounted(() => {
    if (!useIsMinWidthLg.value) initGesture()
})

watch(currentIndex, () => {
    if (useIsMinWidthLg.value) return
    destroyGesture()
    initGesture()
})

watch(useIsMinWidthLg, () => {
    if (useIsMinWidthLg.value) destroyGesture()
    else initGesture()
})

watch(scale, (newScale) => {
    if (useIsMinWidthLg.value) return
    if (newScale > 1) destroyGesture()
    else initGesture()
})

onUnmounted(() => destroyGesture())
</script>

<template>
    <dialog
        ref="root"
        :class="[
            $style.root,
            scale > 1 && $style['root--is-zoomed'],
            isSingleMedia && $style['root--is-single-media'],
            currentMediaIsImageType && $style['root--is-image-media'],
            isCurrentMediaVideoType && $style['root--is-video-media'],
        ]"
        tabindex="-1"
    >
        <div :class="[$style.wrapper]">
            <!-- INFOS -->
            <section :class="$style['section-infos']">
                <div :class="[$style['top-bar']]">
                    <div :class="[$style['top-bar-inner']]">
                        <VMediaViewerControls
                            :close="closeMediaViewer"
                            :on-prev="carouselRef?.triggerPrev"
                            :on-next="carouselRef?.triggerNext"
                            :current-index="(carouselRef?.currentIndex || 0) + 1"
                            :total-indexes="documents?.length"
                            :display-carousel-controls="!isSingleMedia"
                            :download-url="currentDocument?.externalUrl"
                        />
                    </div>
                </div>
                <VMediaViewerDetails
                    v-if="currentDocument?.description || currentDocument?.copyright || currentDocument?.externalUrl"
                    :class="$style.details"
                    :title="currentDocument?.name"
                    :description="currentDocument?.description"
                    :copyright="currentDocument?.copyright"
                    :external-url="currentDocument?.externalUrl"
                    :description-id="descriptionId"
                    :copyright-id="copyrightId"
                    :external-url-id="externalUrlId"
                />
            </section>

            <!-- MEDIA -->
            <section :class="$style['section-media']">
                <div
                    ref="carouselWrapperRef"
                    :class="$style['carousel-wrapper']"
                >
                    <VNativeCarousel
                        ref="carouselRef"
                        :class="$style.carousel"
                        :list-class-name="$style.list"
                        :enable-drag="carouselEnabled"
                        :enable-scroll="carouselEnabled"
                    >
                        <template #default="{ classItem, slideAttrs }">
                            <li
                                v-for="(media, index) in documents"
                                :key="index"
                                :ref="(el) => setCarouselItemRef(el, index)"
                                :class="[classItem, $style.item, index === carouselRef?.currentIndex ? $style['item--is-active']: $style['item--is-not-active']]"
                                :style="index === currentIndex ? zoomStyle : undefined"
                                v-bind="slideAttrs(index, Array.isArray(documents) ? documents.length : 0)"
                                @dblclick="currentMediaIsImageType ? handleDblClick() : undefined"
                            >
                                <VRoadizMedia
                                    :ref="(el) => setMediaRef(el, index)"
                                    :aria-describedby="index === currentIndex ? detailsDescribedBy : undefined"
                                    :class="$style['carousel-media']"
                                    :document="media"
                                    :video="{ preload: true, playsinline: true }"
                                />
                            </li>
                        </template>
                    </VNativeCarousel>
                </div>

                <!-- Zoom buttons -->
                <div
                    v-if="currentMediaIsImageType"
                    :class="[$style['zoom-buttons']]"
                >
                    <VIconButton
                        :class="$style['button-zoom-in']"
                        icon-name="PlusMD"
                        emphasis="low"
                        design="soft"
                        :disabled="zoomAtMax"
                        :aria-label="t('media_viewer_controls.zoom_in')"
                        @click="handleZoomIn"
                    />
                    <VIconButton
                        :class="$style['button-zoom-out']"
                        icon-name="MinusMD"
                        emphasis="low"
                        design="soft"
                        :disabled="zoomAtMin"
                        :aria-label="t('media_viewer_controls.zoom_out')"
                        @click="handleZoomOut"
                    />
                </div>
            </section>
        </div>
    </dialog>
</template>

<style lang="scss" module>
.root {
    --v-media-viewer-top-bar-height: 72px;
    --v-media-viewer-details-when-is-closed-height: 70px;
    --v-media-viewer-details-close-visible-offset: 38px;

    z-index: var(--z-index-v-media-viewer, 101);
    position: fixed;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    inset: 0;
    padding: 0;
    border: none;
    // important because the details are "translateY"
    overflow: hidden;
}

.wrapper {
    position: relative;
    // keep internal the children z-index position
    isolation: isolate;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    background: var(--theme-colors-surface-light-tertiary);

    // To avoid see grey background behind the details
    .root--is-video-media & {
        background: $colors-black-full;
        @include media('>=lg') {
            background: initial;
        }
    }

    @include media('>=lg') {
        // reset
        background: transparent;
        flex-direction: unset;
        justify-content: unset;

        @include grid;
        grid-auto-flow: dense;

        .section-media {
            grid-column: 1 / span 8;
        }
        .section-infos {
            grid-column: 9 / span 4;
        }
    }

    @include media('>=xl') {
        .section-media {
            grid-column: 1 / span 9;
        }
        .section-infos {
            grid-column: 10 / span 3;
        }
    }

    @include media('>=hd') {
        .section-media {
            grid-column: 1 / span 10;
        }
        .section-infos {
            grid-column: 11 / span 2;
        }
    }

}

// ------------------------------------------------- SECTION INFOS

.section-infos {
    z-index: 1;
    background: var(--theme-color-surfaces-primary);
    @include media('>=lg') {

        // important to not be relative on mobile
        // because internal element (summary/details) are absolute
        // and need to be relative to the root, not the section in mobile size
        position: relative;
    }
}

.top-bar {
    width: 100%;
    background: var(--theme-color-surfaces-primary);
    height: var(--v-media-viewer-top-bar-height);
}

.top-bar-inner {
    @include grid-container;

    @include media('>=lg') {
        width: 100%;
     }
}

.details {
    z-index: 2;
    --v-media-viewer-details-open-offset: var(--v-media-viewer-top-bar-height);
}

// ------------------------------------------------- SECTION MEDIA

.section-media {
    position: relative;
    z-index: 0;
    overflow: hidden;
    height: calc(100% - var(--v-media-viewer-top-bar-height) - var(--v-media-viewer-details-when-is-closed-height));
    background: var(--theme-colors-surface-light-tertiary);

    .root--is-video-media & {
        background: $colors-black-full;
    }
    transition: background-color 0.3s ease-out;

    @include media('>=lg') {
        height: 100%;
        max-height: 100vh;
        // need a border white --gutter size top bottom right
        $border: var(--gutter) solid var(--theme-color-surfaces-primary);
        border-right: $border;
        border-top: $border;
        border-bottom: $border;
    }
}

// ---------------- CAROUSEL

.carousel-wrapper {
    height: 100%;
    position: relative;
}

.carousel {
    height: 100%;
    --v-native-carousel-list-height: 100%;
    --v-native-carousel-item-height: 100%;
}

.list {
    padding: var(--gutter);
    scroll-padding-inline: var(--gutter);
    @include media('>=lg') {
        padding: 0;
    }
}

.item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    opacity: 1;
    transition: opacity 0.2s ease-out;
    &--is-not-active {
        opacity: 0;
    }
}

.carousel-media {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    --v-roadiz-video-root-height: 100%;
    --v-roadiz-video-thumbnail-height: 100%;
    --v-roadiz-video-thumbnail-object-fit: contain;

    // Video: force the wrapper to fill the carousel item — without an explicit width,
    // the flex layout collapses to the thumbnail's intrinsic size on iOS.
    .root--is-video-media & {
        width: 100%;
        height: 100%;
    }

    // Tricky: plyr video set the height to 100%, the video is cap to the top of the container
    // to make it centered, set the height to auto
    & :global(.plyr__video-wrapper) {
        height: auto !important;
    }
}

// ---------------- ZOOM BUTTONS

.zoom-buttons {
    position: absolute;
    top: var(--spacing-xs);
    left: var(--spacing-xs);
    display: flex;
    gap: var(--spacing-4xs);
}
</style>
