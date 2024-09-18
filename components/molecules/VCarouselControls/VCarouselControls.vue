<script setup lang="ts">
import type { ThemeProps } from '#imports'

interface VCarouselControlsProps extends ThemeProps {
    length: number
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

watch(() => props.length, () => {
    setIndicatorWidth()
    setIndicatorPosition(index.value)
})

watch(index, (newIndex) => {
    setIndicatorPosition(newIndex)
})

const slidePosition = computed(() => {
    if (!props.displayNumbers) return

    return `${formatValue(index.value)} / ${formatValue(props.length - 1)}`
})

function formatValue(n: number) {
    return (n < 9 ? '0' : '') + (n + 1)
}

function setIndicatorWidth() {
    if (!scroll.value || !thumb.value) return // can be undefined in SSR

    thumb.value?.style.setProperty('--thumb-width', (scroll.value?.offsetWidth / props.length / scroll.value?.offsetWidth) * 100 + '%')
}

function setIndicatorPosition(index: number) {
    if (!scroll.value || !thumb.value) return

    const percent = index / (props.length - 1)
    const translate = percent * (scroll.value?.offsetWidth - thumb.value?.getBoundingClientRect().width)

    thumb.value.style.translate = translate + 'px 0 '
}

function onClick(event: Event) {
    const direction = (event.currentTarget as HTMLButtonElement).name === 'next' ? 1 : -1
    index.value = index.value + direction
}
</script>

<template>
    <div :class="$style.root">
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
            :disabled="index === 0"
            :theme="theme"
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
            :disabled="index === length - 1 || isEnd"
            :theme="theme"
            :class="$style.button"
            @click="onClick"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    display: var(--v-carousel-controls-display, flex);
    align-items: center;
    justify-content: var(--v-carousel-controls-justify-content, center);
    gap: rem(8);
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
    --thumb-width: 100%;

    position: relative;
    width: clamp(#{rem(22)}, var(--thumb-width), 50%);
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
