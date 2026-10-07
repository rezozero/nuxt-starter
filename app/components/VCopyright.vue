<script setup lang="ts">
import type { ThemeProps } from '~~/types/theme'

defineProps<{
    content?: string
} & ThemeProps>()

const id = useId()

const isExpanded = ref(false)
function toggle() {
    isExpanded.value = !isExpanded.value
}

// Hover
const isMouseHovered = ref(false)
const onMouseEnter = () => isMouseHovered.value = true
const onMouseLeave = () => isMouseHovered.value = false
watch(isMouseHovered, (value) => {
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
        :class="$style.root"
        :aria-label="$t('copyright.aria_label')"
        aria-live="polite"
        @mouseleave="onMouseLeave"
    >
        <VCopyrightButton
            :class="$style.button"
            :aria-controls="id"
            :aria-expanded="isExpanded"
            :aria-label="isExpanded ? $t('copyright.close') : $t('copyright.open')"
            @touchend="onTouchEnd"
            @mouseenter="onMouseEnter"
            @keyup.enter="toggle"
        />
        <slot
            :id="id"
            :item-class="$style.content"
            :is-expanded="isExpanded"
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
.root {
    display: grid;
    justify-content: end;
    row-gap: 6px;
}

.button {
    grid-column: 1;
    grid-row: 2;
    justify-self: end;
}

.content {
    max-width: 276px;
    padding: var(--spacing-2xs);
    border: 1PX solid #ccc;
    border-radius: 4PX;
    background: #fff;
    color: #000;
    grid-column: 1;
    grid-row: 1;
    opacity: 0;
    transition-delay: 0s, 0.2s;
    transition-duration: 0.2s, 0s;
    transition-property: opacity, visibility;
    visibility: hidden;

    p {
        &:first-child {
            margin: 0;
        }
    }

    .button[aria-expanded="true"] + & {
        opacity: 1;
        transition-delay: 0s, 0s;
        visibility: inherit;
    }
}
</style>
