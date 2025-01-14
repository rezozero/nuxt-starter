<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import type Plyr from 'plyr'
import { isVideo } from '~/utils/roadiz/document'

const id = useId()

const theme = 'dark'

const { themeClass } = useThemeProvider({ preferredTheme: theme })

const { documents, slideIndex, close, nextSlide, previousSlide } = useMediaViewer()

const snapLength = ref(documents.value?.length || 0)

useEventListener('keyup', onKeyPressed)

function onKeyPressed(event: KeyboardEvent) {
    if (event.key === 'Escape') close()
    else if (event.key === 'ArrowLeft') previousSlide()
    else if (event.key === 'ArrowRight') nextSlide()
}

const copyrightContent = computed(() => {
    return documents.value?.[slideIndex.value]?.copyright
})

const description = computed(() => {
    return documents.value?.[slideIndex.value]?.description
})

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
    >
        <VButton
            :class="$style.close"
            icon-name="cross-small"
            emphasis="low"
            @click="close"
        />
        <VCarouselControls
            v-if="documents?.length && documents.length > 1"
            v-model="slideIndex"
            :snap-length="snapLength"
            :class="$style.controls"
            :theme="theme"
        />
        <VCarousel
            v-if="documents?.length"
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
                    @ready="(plyr) => onPlyrReady(plyr, documentIndex)"
                />
                <div
                    v-if="document.description"
                    :class="$style.description"
                >
                    <VClampedText
                        :content="document.description"
                        :lines="1"
                    />
                </div>
            </div>
        </VCarousel>
        <VCopyright
            v-if="copyrightContent"
            :class="$style.copyright"
            :content="copyrightContent"
            :container="'#' + id"
        />
    </dialog>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;
@use "assets/scss/mixins/theme" as *;
@use "assets/scss/mixins/include-media" as *;

.root {
    --v-img-height: #{calc(100% - #{rem(262)})};

    position: fixed;
    z-index: 101;
    display: flex;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    flex-direction: column;
    padding: var(--gutter);
    border: none;
    background-color: var(--theme-color-surfaces-primary);
    color: var(--theme-color-content-primary);
    inset: 0;

    @include theme-variants($match: 'surfaces-' 'content-' 'lines-' 'links-' 'control-');

    &::after {
        position: absolute;
        z-index: -1;
        background-color: var(--theme-color-surfaces-primary);
        content: '';
        inset: 0;
    }

    @include media('>=lg') {
        padding: 0 calc((100vw - var(--gutter) * 4) / 12 + var(--gutter) * 2);
    }
}

.close {
    position: absolute;
    z-index: 2;
    top: rem(16);
    right: var(--gutter);

    @include media('>=lg') {
        top: rem(24);
        right: rem(24);
    }
}

.carousel {
    --v-carousel-slide-width: calc(100vw - var(--gutter) * 2);
    --v-carousel-slide-margin-right: var(--gutter);
    --v-carousel-swiper-wrapper-height: 100%;

    overflow: hidden;
    height: 100%;
    align-items: center;

    @include media('>=lg') {
        --v-carousel-slide-width: calc((100vw - var(--gutter) * 4) * 10 / 12);
        --v-carousel-slide-height: 100vh;
        --v-carousel-slide-margin-right: calc(#{flex-grid(1, 12, 'vw', true)} + var(--gutter) * 3);
    }
}

.slide {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(24);
    padding-block: rem(130);

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
    bottom: rem(32);
    left: 0;
    width: 100%;
    text-align: center;

    > div:first-child * {
        opacity: 0.8;
    }

    p {
        padding: 0;
    }
}

.controls {
    position: absolute;
    inset: 0;
    transform: initial;

    > div {
        position: absolute;
        top: rem(28);
        left: 50%;
        transform: translateX(-50%);

        @include media('>=md') {
            top: rem(34);
        }
    }

    > button {
        display: none;

        @include media('>=lg') {
            position: absolute;
            top: 50%;
            display: block;
            transform: translateY(-50%);

            &:first-of-type {
                left: var(--gutter);
            }

            &:last-of-type {
                right: var(--gutter);
            }
        }
    }
}

.copyright {
    --v-copyright-right: #{rem(20)};
    --v-copyright-bottom: #{rem(26)};

    @include media('>=md') {
        --v-copyright-right: #{rem(32)};
        --v-copyright-bottom: #{rem(32)};
    }
}
</style>
