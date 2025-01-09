<script setup lang="ts">
import type { ThemeProps } from '#imports'

interface VCarouselControlsProps extends ThemeProps {
    slideLength?: number
    snapLength: number
    displayNumbers?: boolean
    isEnd?: boolean
}

const props = defineProps<VCarouselControlsProps>()
const scroll = ref<HTMLInputElement | null>(null)
const thumb = ref<HTMLInputElement | null>(null)

const index = defineModel<number>({ default: 0 })

onMounted(() => {
    setIndicatorWidth()
    setIndicatorPosition(index.value)
})

watch(() => props.snapLength, () => {
    setIndicatorWidth()
    setIndicatorPosition(index.value)
})

watch(index, (newIndex) => {
    setIndicatorPosition(newIndex)
})

const slidePosition = computed(() => {
    if (!props.displayNumbers) return

    return `${formatValue(index.value)} / ${formatValue(props.snapLength - 1)}`
})

function formatValue(n: number) {
    return (n < 9 ? '0' : '') + (n + 1)
}

function setIndicatorWidth() {
    if (!scroll.value || !thumb.value) return // can be undefined in SSR

    thumb.value?.style.setProperty('--v-carousel-controls-thumb-width', (scroll.value?.offsetWidth / props.snapLength / scroll.value?.offsetWidth) * 100 + '%')
}

function setIndicatorPosition(index: number) {
    if (!scroll.value || !thumb.value) return

    const percent = index / (props.snapLength - 1)
    const translate = percent * (scroll.value?.offsetWidth - thumb.value?.getBoundingClientRect().width)

    thumb.value.style.translate = translate + 'px 0 '
}

function onClick(event: Event) {
    const direction = (event.currentTarget as HTMLButtonElement).name === 'next' ? 1 : -1
    index.value = index.value + direction
}

const prevBtnDisabled = computed(() => index.value === 0)
const nextBtnDisabled = computed(() => {
    return (index.value === props.snapLength - 1) || props.isEnd
})

const isCarouselDraggable = computed(() => {
    if (!props.slideLength) return true
    return (props.slideLength > props.snapLength) && props.snapLength > 1
})

const isInert = ref(false)
onMounted(() => isInert.value = !isCarouselDraggable.value)
watch(isCarouselDraggable, value => isInert.value = !value)
</script>

<template>
    <div
        :class="[$style.root, isCarouselDraggable && $style['root--carousel-draggable']]"
        :inert="isInert || undefined"
    >
        <div
            ref="scroll"
            :class="$style.scroll"
        >
            <div
                ref="thumb"
                :class="$style.thumb"
            />
        </div>
        <VButton
            name="previous"
            icon-name="arrow-left"
            :aria-label="$t('carousel.previous_slide_label')"
            :disabled="prevBtnDisabled"
            :theme="!!theme ? theme : undefined"
            :class="$style.button"
            @click="onClick"
        />
        <div
            v-if="slidePosition"
            class="text-body-xs"
            :class="$style.number"
        >
            <span>{{ slidePosition }}</span>
        </div>
        <VButton
            name="next"
            icon-name="arrow-right"
            :aria-label="$t('carousel.next_slide_label')"
            :disabled="nextBtnDisabled"
            :theme="!!theme ? theme : undefined"
            :class="$style.button"
            @click="onClick"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    display: var(--v-carousel-controls-display, flex);
    align-items: center;
    justify-content: var(--v-carousel-controls-justify-content, center);
    gap: rem(8);
    opacity: 0;
    transition: opacity 0.3s;

    &--carousel-draggable {
        opacity: var(--v-carousel-controls-opacity, 1);
    }

    &[aria-hidden="true"] {
        pointer-events: none;
    }
}

.scroll {
    position: relative;
    overflow: hidden;
    width: rem(64);
    height: rem(3);
    flex-shrink: 0;

    @include media('>=md') {
        margin-right: rem(40);
    }

    &::before {
        position: absolute;
        background-color: var(--theme-color-controls-selected, color-mix(in srgb, currentColor, transparent 70%));
        content: '';
        inset: 0;
        opacity: 0.2;
    }
}

.thumb {
    position: relative;
    width: clamp(#{rem(22)}, var(--v-carousel-controls-thumb-width), 100%);
    height: 100%;
    background-color: var(--theme-color-controls-selected, currentColor);
    content: '';
    transform-origin: left;
    transition: 0.2s linear, 0.5s;
    transition-property: translate, width;
}

.number {
    display: var(--v-carousel-controls-numbers-display, block);

    @include media('>=lg') {
        display: var(--v-carousel-controls-numbers-display, none);
    }
}

.button {
    --v-button-display: none;

    @include media('>=md') {
        --v-button-display: block;
    }
}
</style>
