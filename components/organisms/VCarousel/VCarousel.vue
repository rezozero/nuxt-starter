<script lang="ts" setup>
import type { Swiper, SwiperModule, SwiperOptions } from 'swiper/types'
import { focusFirstElement } from '~/utils/a11y/focusable'
import { getHtmlElement } from '~/utils/ref/get-html-element'

export interface VCarouselProps {
    tag?: string
    role?: string
    swiperWrapperTag?: string
    swiperWrapperClass?: string
    lazy?: boolean
    asyncSlides?: boolean
    swiperOptions?: SwiperOptions
}

const slideIndex = defineModel<number>('index', { default: 0 })
const snapLength = defineModel<number>('snapLength')
const carouselEnabled = defineModel<boolean>('enabled', { default: false })

const props = withDefaults(defineProps<VCarouselProps & { index?: number, enabled: boolean } >(), { lazy: true })

const emit = defineEmits<{
    progress: [number]
    onSlideEnd: []
}>()

const root = ref<HTMLElement | null>(null)
const swiperWrapper = ref<HTMLElement | null>(null)

useCarousel({
    element: swiperWrapper,
    lazy: props.lazy,
    asyncSlides: props.asyncSlides,
    init: createSwiper,
})

// STYLE
const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root]
})

// SWIPER
let isLoadingSwiper: boolean = false
let swiper: Swiper | null = null
let resizeObserver: ResizeObserver | null = null

const slots = defineSlots<{
    default: (slotProps: { slideClass: string[] }) => void
}>()

async function createSwiper() {
    if (!slots?.default || swiper || isLoadingSwiper || !root.value) return

    isLoadingSwiper = true

    const SwiperBundle = await import('swiper')
    const modules: SwiperModule[] = []
    const options = props.swiperOptions

    isLoadingSwiper = false

    // TODO: load modules on demand
    // if (props.swiperOptions?.freeMode) {
    //     const { FreeMode } = await import('swiper/modules')
    //     modules.push(FreeMode)
    // }
    // if (props.effect === 'creative') modules.push(SwiperBundle.EffectCreative)

    resizeObserver = new ResizeObserver(onResizeObserverChange)

    swiper = new SwiperBundle.Swiper(root.value, {
        modules,
        // grabCursor: true,
        preventInteractionOnTransition: false,
        threshold: 6,
        slidesPerView: 'auto',
        wrapperClass: $style['swiper-wrapper'],
        loopPreventsSliding: false,
        touchEventsTarget: 'container', // fire touchStart event also on slide margin
        watchOverflow: true,
        initialSlide: slideIndex.value,
        ...props.swiperOptions,
        on: {
            ...props.swiperOptions?.on,
            snapIndexChange: (swiper: Swiper): void => {
                slideIndex.value = options?.loop ? swiper.realIndex : swiper.snapIndex
                // emit('update:modelValue', options?.loop ? swiper.realIndex : swiper.snapIndex)

                // with slidesPerView: 'auto' slideNext is disabled when last slide is fully enter in window
                if (swiper.isEnd) emit('onSlideEnd')
            },
            init: (swiper: Swiper): void => {
                swiper && options?.on?.init?.(swiper)
                resizeObserver?.observe(swiper.wrapperEl)
                checkSwiperActivation(swiper)
                updateSlidesFocusCapability(swiper)
            },
            update: (swiper: Swiper): void => {
                checkSwiperActivation(swiper)
            },
            progress: (_swiper: Swiper, progress: number) => {
                emit('progress', progress)
            },
            slideChangeTransitionEnd: (swiper: Swiper) => {
                updateSlidesFocusCapability(swiper)

                const currentSlideEl = swiper.slides[swiper.realIndex]
                if (currentSlideEl) focusFirstElement(currentSlideEl)
            },
            snapGridLengthChange: (swiper: Swiper) => {
                snapLength.value = swiper.snapGrid.length
            },
        },
    })
}

function disposeSwiper() {
    resizeObserver?.disconnect()
    resizeObserver = null

    swiper?.destroy(true, false)
}

function checkSwiperActivation(swiper: Swiper) {
    const slideWrapperEl = getHtmlElement(swiperWrapper)
    const isGrid = !!slideWrapperEl && getComputedStyle(slideWrapperEl).display === 'grid'
    const hasColumnFlexDirection = !!slideWrapperEl && getComputedStyle(slideWrapperEl).flexDirection === 'column'

    if ((swiper.allowSlideNext || swiper.allowSlidePrev) && !isGrid && !hasColumnFlexDirection) {
        swiper.enable()
        carouselEnabled.value = true
        swiper.setGrabCursor()
    }
    else {
        swiper.slideTo(0)
        swiper.disable()
        carouselEnabled.value = false
        swiper.unsetGrabCursor()
    }
}

function updateSlidesFocusCapability(swiper: Swiper) {
    const { watchSlidesProgress } = props.swiperOptions || {}

    swiper.slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect()
        const isHidden
            = rect.right < rect.width * 0.25
            || rect.left >= window.innerWidth - rect.width * 0.25
            || (watchSlidesProgress ? !slide.classList.contains('swiper-slide-visible') : false)

        slide.toggleAttribute('inert', index !== swiper.activeIndex && isHidden)
    })
}

function onResizeObserverChange() {
    if (!swiper) return

    swiper.update()
    updateSlidesFocusCapability(swiper)
}

watch(
    () => props.index,
    () => {
        if (typeof props.index === 'undefined' || !swiper) return

        if (props.swiperOptions?.loop) swiper.slideToLoop(props.index)
        else swiper.slideTo(props.index)
    },
)

onBeforeUnmount(disposeSwiper)
</script>

<template>
    <component
        :is="tag || 'div'"
        ref="root"
        :class="rootClasses"
    >
        <component
            :is="swiperWrapperTag || 'div'"
            ref="swiperWrapper"
            :class="[$style['swiper-wrapper'], swiperWrapperClass]"
        >
            <slot :slide-class="[$style.slide, 'swiper-slide']" />
        </component>
    </component>
</template>

<style lang="scss" module>
.root {
    display: flex;
    width: var(--v-carousel-width, 100%);

    // Remove default focus style
    a:focus-visible,
    button:focus-visible {
        outline: none;
    }
}

.swiper-wrapper {
    display: flex;
    min-width: var(--v-carousel-swiper-wrapper-min-width, 100%);
    max-width: var(--v-carousel-swiper-wrapper-max-width, 100%);
    height: var(--v-carousel-swiper-wrapper-height);
    flex-shrink: 0;
    align-items: var(--v-carousel-swiper-wrapper-align-item);
    justify-content: var(--v-carousel-swiper-wrapper-justify-content);
    gap: var(--v-carousel-swiper-wrapper-gap);
    touch-action: pan-y;
}

.slide {
    width: var(--v-carousel-slide-width, 100%);
    height: var(--v-carousel-slide-height);
    flex-shrink: 0;
    margin-right: var(--v-carousel-slide-margin-right);

    &:last-child {
        margin-right: 0;
    }
}
</style>
