<script setup lang="ts">
import type { Theme } from '#imports'

interface VCarouselControlsProps {
    index: number
    length: number
    displayNumbers?: boolean
    isEnd?: boolean
    theme?: Theme | false
}

const props = defineProps<VCarouselControlsProps>()

const emit = defineEmits<{
    'update:index': [number]
}>()

function onClick(event: Event) {
    const direction = (event.currentTarget as HTMLButtonElement).name === 'next' ? 1 : -1
    emit('update:index', props.index + direction)
}

function formatValue(n: number) {
    return (n < 9 ? '0' : '') + (n + 1)
}
</script>

<template>
    <div :class="$style.root">
        <VButton
            control
            name="previous"
            :disabled="index === 0"
            :aria-label="$t('carousel.previous_slide_label')"
            :class="$style.button"
            :theme="theme"
            @click="onClick"
        >
            <template #icon>
                <VIcon name="arrow-left" />
            </template>
        </VButton>
        <div
            v-if="displayNumbers"
            class="text-body-xs"
            :class="$style.number"
        >
            <span>{{ formatValue(index) }} / {{ formatValue(length - 1) }}</span>
        </div>
        <VButton
            control
            name="next"
            :disabled="index === length - 1 || isEnd"
            :aria-label="$t('carousel.next_slide_label')"
            :class="$style.button"
            :theme="theme"
            @click="onClick"
        >
            <template #icon>
                <VIcon name="arrow-right" />
            </template>
        </VButton>
    </div>
</template>

<style lang="scss" module>
.root {
    display: var(--v-carousel-controls-display, flex);
    align-items: center;
    justify-content: center;
    gap: rem(16);

    @include media('>=lg') {
        height: rem(62);
    }
}

.number {
    display: var(--v-carousel-controls-numbers-display, block);

    @include media('>=lg') {
        display: var(--v-carousel-controls-numbers-display, none);
    }
}

.button {
    --v-button-height: rem(24);
    --v-button-min-width: rem(24);
    --v-button-max-width: rem(24);
    --v-button-padding-inline: 0;
}
</style>
