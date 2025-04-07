<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
    label: { type: String },
    size: { type: String as PropType<'sm' | 'md'>, default: 'md' },
})
</script>

<template>
    <VTag
        :label="label"
        :size="size"
        :class="$style.root"
        tag="button"
    >
        <slot>{{ label }}</slot>
        <VIcon
            :class="$style.icon"
            name="cross-small"
        />
    </VTag>
</template>

<style lang="scss" module>
.root {
    transition: background-color 0.3s;

    &:hover {
        --v-tag-background-color: #ccc;
    }
}

.icon {
    margin-left: px-to-rem(4);
}
</style>
