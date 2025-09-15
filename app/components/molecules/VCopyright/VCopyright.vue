<script setup lang="ts">
import type { ThemeProps } from '~~/types/theme'

const props = defineProps<{
    content?: string
} & ThemeProps>()

const { themeClass } = useTheme({ props })

const id = useId()

const isExpanded = ref(false)
const toggle = () => isExpanded.value = !isExpanded.value

// Hover
const isMouseEnter = ref(false)
const onMouseenter = () => isMouseEnter.value = true
const onMouseLeave = () => isMouseEnter.value = false
watch(isMouseEnter, (value) => {
    isExpanded.value = value
})

// Click & Touch
const isMouseDevice = useMediaQuery('(hover: hover)')

function onTouchEnd() {
    if (isMouseDevice.value) return

    toggle()
}
</script>

<template>
    <div
        :class="[$style.root, themeClass]"
        @mouseleave="onMouseLeave"
    >
        <VCopyrightButton
            ref="button"
            :class="$style.button"
            :aria-controls="id"
            :aria-expanded="isExpanded"
            @touchend="onTouchEnd"
            @mouseenter="onMouseenter"
            @keyup.enter="toggle"
        />
        <slot
            :id="id"
            :item-class="$style.content"
            :aria-hidden="!isExpanded"
        >
            <VMarkdown
                v-if="content"
                :id="id"
                :aria-hidden="!isExpanded"
                :class="$style.content"
                :content="content"
            />
        </slot>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;

$leave-delay: 0.1s;

.root {
    position: absolute;
    right: var(--v-copyright-right, 16px);
    bottom: var(--v-copyright-bottom, 16px);
    display: flex;
    max-width: 276px;
    flex-direction: column-reverse;
    border: 1px solid var(--v-copyright-border-color, transparent);
    border-radius: 4px;
    transition-delay: $leave-delay;
    transition-duration: 0.2s;
    transition-property: border-color, background-color;

    @include theme-variants('copyright');

    &:has(.button[aria-expanded="false"]) {
        pointer-events: none;
    }

    &:has(.button[aria-expanded="true"]) {
        --v-copyright-border-color: var(--colors-copyright-border-dialog, rgba(1, 1, 1, 15%));

        background-color: var(--colors-surface-primary, #FFF);
        transition-delay: initial;
    }
}

.button {
    align-self: flex-end;
    pointer-events: all;

    &:focus {
        outline-offset: 0;
    }
}

.content {
    opacity: 0;
    transition-delay: $leave-delay;
    transition-duration: 0.2s;
    transition-property: opacity;

    .button[aria-expanded="true"] + & {
        opacity: 1;
        transition-delay: initial;
    }
}
</style>
