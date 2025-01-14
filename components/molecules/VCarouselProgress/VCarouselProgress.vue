<script  lang="ts" setup>
import type { ThemeProps } from '~/composables/use-theme'

const props = defineProps<{
    index: number
    snapLength: number
} & ThemeProps>()

const { themeClass } = useTheme({ props })

const root = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)

onMounted(() => {
    setIndicatorWidth()
    setIndicatorPosition(props.index)
})

watch(() => props.snapLength, () => {
    setIndicatorWidth()
    setIndicatorPosition(props.index)
}, { flush: 'post' })

watch(() => props.index, (newIndex) => {
    setIndicatorPosition(newIndex)
})

function setIndicatorWidth() {
    if (!root.value?.offsetWidth || !thumb.value) return // can be undefined in SSR

    const value = (root.value?.offsetWidth / Math.max(props.snapLength, 1) / root.value?.offsetWidth) * 100

    thumb.value?.style.setProperty('--v-carousel-controls-thumb-width', value + '%')
}

function setIndicatorPosition(index: number) {
    if (!root.value || !thumb.value) return

    const percent = index / Math.max(props.snapLength - 1, 1)
    const translate = percent * (root.value?.offsetWidth - thumb.value?.getBoundingClientRect().width)

    thumb.value.style.translate = translate + 'px 0 '
}
</script>

<template>
    <div
        ref="root"
        :class="[$style.root, themeClass]"
    >
        <div
            ref="thumb"
            :class="$style.thumb"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/include-media' as *;
@use 'assets/scss/mixins/theme' as *;

.root {
    position: relative;
    overflow: hidden;
    width: rem(48);
    height: rem(2);
    flex-shrink: 0;

    @include theme-variants('colors-control');

    &::before {
        position: absolute;
        background-color: var(--theme-colors-control-content-disabled, #ccc);
        content: '';
        inset: 0;
    }

    @include media('>=lg') {
        width: rem(64);
    }
}

.thumb {
    position: relative;
    width: clamp(#{rem(22)}, var(--v-carousel-controls-thumb-width), 100%);
    height: 100%;
    background-color: var(--theme-colors-control-content, currentColor);
    content: '';
    transform-origin: left;
    transition: 0.2s linear, 0.5s;
    transition-property: translate, width;
}
</style>
