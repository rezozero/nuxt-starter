<script setup lang="ts">
import type { ThemeProps } from '#imports'
import { useCarouselControls } from '~/composables/use-carousel-controls'

type VCarouselControlsProps = ThemeProps & {
    snapLength: number
    displayNumbers?: boolean
}
const index = defineModel<number>({ default: 0 })

const props = defineProps<VCarouselControlsProps>()

const snapLength = ref(props.snapLength)
watch(() => props.snapLength, v => snapLength.value = v)

const { numbersOutput, prevButtonAttrs, isCarouselDraggable, nextButtonAttrs } = useCarouselControls({
    displayNumbers: props.displayNumbers,
    snapLength,
    index,
})

const ariaHidden = ref(false)
onMounted(() => ariaHidden.value = !isCarouselDraggable.value)
watch(isCarouselDraggable, value => ariaHidden.value = !value)
</script>

<template>
    <div
        :class="[$style.root, isCarouselDraggable && $style['root--carousel-draggable']]"
        :aria-hidden="ariaHidden || undefined"
    >
        <div
            v-if="numbersOutput"
            class="text-body-xs"
            :class="$style.numbers"
        >
            <span>{{ numbersOutput }}</span>
        </div>
        <VButton
            v-bind="prevButtonAttrs"
            :class="$style['button-prev']"
        />
        <VCarouselProgress
            :index="index"
            :snap-length="snapLength"
        />
        <VButton
            v-bind="nextButtonAttrs"
            :class="$style['button-next']"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/include-media' as *;

.root {
    display: var(--v-carousel-controls-display, flex);
    align-items: center;
    justify-content: var(--v-carousel-controls-justify-content, center);
    gap: px-to-rem(8);
    opacity: 0;
    transition: opacity 0.3s;

    &[aria-hidden="true"] {
        display: var(--v-carousel-controls-hidden-display, none);
    }

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
    width: px-to-rem(64);
    height: px-to-rem(3);
    flex-shrink: 0;

    @include media('>=md') {
        margin-right: px-to-rem(40);
    }

    &::before {
        position: absolute;
        background-color: color-mix(in srgb, currentcolor, transparent 70%);
        content: '';
        inset: 0;
        opacity: 0.2;
    }
}

.thumb {
    position: relative;
    width: clamp(#{px-to-rem(22)}, var(--v-carousel-controls-thumb-width), 100%);
    height: 100%;
    background-color: currentcolor;
    content: '';
    transform-origin: left;
    transition: 0.2s linear, 0.5s;
    transition-property: translate, width;
}

.numbers {
    display: var(--v-carousel-controls-numbers-display, block);
}

.button {
    --v-button-display: none;

    @include media('>=md') {
        --v-button-display: block;
    }
}
</style>
