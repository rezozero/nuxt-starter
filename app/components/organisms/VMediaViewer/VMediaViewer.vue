<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import type Plyr from 'plyr'
import { isVideo } from '~/utils/roadiz/document'

const id = useId()
const carouselId = useId()

const theme = 'dark'
const { themeClass } = useThemeProvider({ preferredTheme: theme })

// Carousel controls
const { documents, slideIndex, close, nextSlide, previousSlide } = useMediaViewer()
const snapLength = ref(documents.value?.length || 0)
const { prevButtonAttrs, nextButtonAttrs } = useCarouselControls({
    snapLength,
    index: slideIndex,
})

useEventListener('keyup', onKeyPressed)
function onKeyPressed(event: KeyboardEvent) {
    if (event.key === 'Escape') close()
    else if (event.key === 'ArrowLeft') previousSlide()
    else if (event.key === 'ArrowRight') nextSlide()
}

// Data
const copyrightContent = computed(() => {
    return documents.value?.[slideIndex.value]?.copyright
})

// Video play state
const plyrInstances = ref<{ index: number, plyr: Plyr }[]>([])
function onPlyrReady(plyr: Plyr, index: number) {
    const isAlreadyInit = plyrInstances.value.find(item => item.index === index)

    if (!isAlreadyInit) {
        plyrInstances.value.push({
            index,
            plyr,
        })
    }
}
watch(
    slideIndex,
    (currentSlideIndex) => {
        const inertVideos = plyrInstances.value.find((item) => {
            return item.index !== currentSlideIndex && !item.plyr.paused
        })

        if (inertVideos) inertVideos.plyr?.pause()
    },
    { flush: 'post' },
)

// Modal state
const root = ref<HTMLDialogElement | null>(null)
onMounted(() => {
    root.value?.showModal()
})
onBeforeUnmount(() => {
    plyrInstances.value = []
    root.value?.close()
})
</script>

<template>
    <dialog
        :id="id"
        ref="root"
        :class="[$style.root, description && $style['root--with-description'], themeClass]"
        :aria-label="$t('media_viewer.aria_label')"
    >
        <VButton
            :class="$style.close"
            icon-name="cross-small"
            emphasis="low"
            :aria-label="$t('v_media_viewer.close_aria_label')"
            @click="close"
        />
        <template v-if="snapLength > 1">
            <VButton
                v-bind="prevButtonAttrs"
                :class="[$style.button, $style['button--prev']]"
                :aria-controls="carouselId"
            />
            <VButton
                v-bind="nextButtonAttrs"
                :class="[$style.button, $style['button--next']]"
                :aria-controls="carouselId"
            />
        </template>

        <VCarousel
            v-if="documents?.length"
            :id="carouselId"
            v-slot="{ slideClass }"
            v-model:index="slideIndex"
            v-model:snap-length="snapLength"
            :class="$style.carousel"
        >
            <div
                v-for="(document, documentIndex) in documents"
                :key="document['@id']"
                :class="[...slideClass, $style.slide]"
            >
                <VRoadizMedia
                    :class="[$style.media, isVideo(document) && $style['media--video']]"
                    :document="document"
                    :image="{
                        sizes: 'sm:100vw xs:100vw md:90vw lg:90vw vl:90vw xl:90vw xxl:90vw hd:90vw qhd:90vw',
                    }"
                    :video="{
                        hideThumbnail: true,
                        autoplay: slideIndex === documentIndex,
                        muted: slideIndex !== documentIndex,
                        playsinline: true,
                    }"
                    @ready="(plyr: Plyr) => onPlyrReady(plyr, documentIndex)"
                />
                <div
                    v-if="document.description"
                    :class="$style.description"
                >
                    <LazyVClampedText
                        :content="document.description"
                        :lines="1"
                    />
                </div>
            </div>
        </VCarousel>

        <LazyVCopyright
            v-if="copyrightContent"
            :class="$style.copyright"
            :content="copyrightContent"
            :container="'#' + id"
        />
    </dialog>
</template>

<style lang="scss" module>
@use "assets/scss/mixins/theme" as *;
@use 'sass:math';

.root {
    --v-media-viewer-slide-padding-block: 130px;
    --v-media-viewer-slide-max-height: calc(100% - var(--v-media-viewer-slide-padding-block) * 2);

    position: fixed;
    z-index: 101;
    display: flex;
    overflow: hidden;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100vh;
    padding: initial;
    border: none;
    margin: initial;
    background-color: var(--colors-surface-primary, #010101);
    color: var(--colors-content-primary, #FFF);
    inset: 0;

    @include theme-variants($match: 'surfaces-' 'content-' 'lines-' 'links-' 'control-');
}

.close {
    position: absolute;
    z-index: 2;
    top: 16px;
    right: var(--gutter);

    @include media('>=lg') {
        top: var(--spacing-md, 24px);
        right: var(--spacing-md, 24px);
    }
}

.button {
    @include media('<lg') {
        display: none;
    }

    @include media('>=lg') {
        position: absolute;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);

        &--prev {
            left: var(--spacing-lg, 2rem);
        }

        &--next {
            right: var(--spacing-lg, 2rem);
        }
    }
}

.carousel {
    --v-carousel-slide-width: 100%;
    --v-carousel-slide-margin-right: 0;
    --v-carousel-swiper-wrapper-height: 100%;
}

.slide {
    --v-img-height: 100%;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md, 24px);
    height: 100%;
    padding-block: var(--v-media-viewer-slide-padding-block);
    padding-inline: var(--gutter);

    // style iframe for audio
    > iframe {
        width: 100%;
        height: auto;
        max-height: 100%;
    }
}
.media {
    z-index: 1;
    display: flex;
    width: auto;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    align-items: center;
    object-fit: contain;
    -webkit-user-drag: none;
    user-select: none;

    :global(.plyr--video) {
        width: 100%;
    }
}

.description {
    position: absolute;
    z-index: 1;
    bottom: var(--spacing-lg, 32px);
    width: min(100%, 80ch);
    text-align: center;
    background-color: var(--colors-surface-primary, #010101);
    padding-inline: var(--spacing-lg, 32px);
    > div:first-child * {
        opacity: 0.8;
    }

    p {
        padding: 0;
    }
}

.copyright {
    --v-copyright-right: var(--spacing-md, 24px);
    --v-copyright-bottom: var(--spacing-md, 24px);

    @include media('>=md') {
        --v-copyright-right: var(--spacing-lg, 32px);
        --v-copyright-bottom: var(--spacing-lg, 32px);
    }
}
</style>
