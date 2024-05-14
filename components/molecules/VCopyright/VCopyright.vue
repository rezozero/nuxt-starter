<script setup lang="ts">
import type { PropType } from 'vue'
import type { Placement } from 'floating-vue'
import { Tooltip as VTooltip } from 'floating-vue'

defineProps({
    placement: {
        type: String as PropType<Placement>,
        default: 'top-end',
    },
    content: { type: String },
})

const id = useId()
</script>

<template>
    <VTooltip
        :distance="9"
        :placement="placement"
        :triggers="['hover', 'focus']"
        :popper-triggers="['hover']"
        :overflow-padding="16"
        :aria-id="id"
        :delay="{ show: 0, hide: 100 }"
        :class="$style.root"
    >
        <button :class="$style.button">
            <VIcon name="copyright" width="8" height="8" />
        </button>
        <template #popper>
            <VMarkdown :class="$style.popper" :content="content">
                <slot />
            </VMarkdown>
        </template>
    </VTooltip>
</template>

<style lang="scss" module>
.root {
    position: absolute;
    right: var(--v-copyright-right, rem(16));
    bottom: var(--v-copyright-bottom, rem(16));
}

.button {
    display: flex;
    width: var(--v-copyright-button-width, rem(16));
    height: var(--v-copyright-button-height, rem(16));
    align-items: center;
    justify-content: center;
    border-radius: 100vmax;
    background-color: var(--v-copyright-button-background-color, #fff);
    color: var(--v-copyright-button-foreground-color, #000);
    transition: background-color 0.3s;

    @include media('>=md') {
        width: var(--v-copyright-button-width, rem(24));
        height: var(--v-copyright-button-height, rem(24));
    }

    @media (hover: hover) {
        &:hover {
            background-color: var(--v-copyright-button-background-color-hover, #ccc);
        }
    }
}

.popper {
    max-width: var(--v-copyright-popper-max-width, rem(200));
}
</style>
