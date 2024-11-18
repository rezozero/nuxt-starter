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
@use "assets/scss/functions/rem" as *;

.root {
    z-index: 1;
    display: var(--v-tag-display, inline-flex);
    align-items: center;
    padding: rem(4 + 4) rem(8 + 4);
    background-color: var(--v-tag-background-color, #f0f0f0);

    &--size-md {
        padding: rem(6 + 4) rem(8 + 4);
    }
}
</style>
