<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
    tag: String,
    label: { type: String },
    size: { type: String as PropType<'sm' | 'md'>, default: 'md' },
})
</script>

<template>
    <component
        :is="tag || 'div'"
        :class="[$style.root, $style[`root--size-${size}`]]"
    >
        <slot>{{ label }}</slot>
    </component>
</template>

<style lang="scss" module>
.root {
    z-index: 1;
    display: var(--v-tag-display, inline-flex);
    align-items: center;
    padding: px-to-rem(4 + 4) px-to-rem(8 + 4);
    background-color: var(--v-tag-background-color, #f0f0f0);

    &--size-md {
        padding: px-to-rem(6 + 4) px-to-rem(8 + 4);
    }
}
</style>
