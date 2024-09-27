<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    lines: {
        type: Number,
        default: 3,
    },
})

const isExpanded = ref(false)
const isDisabled = ref(props.lines === 0)
const root = ref<ComponentPublicInstance | null>(null)

function updateDisabled() {
    const element = (root.value as ComponentPublicInstance)?.$el as HTMLElement

    if (!element) return

    isDisabled.value = !isExpanded.value && element.scrollHeight <= element.clientHeight
}

onMounted(updateDisabled)
useResizeObserver(root, updateDisabled)
</script>

<template>
    <VMarkdown
        ref="root"
        :class="[
            $style.root,
            isExpanded && $style['root--expanded'],
            lines === 0 && !isExpanded && $style['root--hidden'],
            isDisabled && $style['root--disabled'],
        ]"
        :content="content"
    />
    <VButton
        :class="$style.toggle"
        :label="isExpanded ? $t('see_less') : $t('see_more')"
        @click="isExpanded = !isExpanded"
    />
</template>

<style lang="scss" module>
.root {
    display: -webkit-box;
    width: 100%;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--v-clamped-text-line-clamp, v-bind(lines));

    // Target only safari browser
    // https://wojtek.im/journal/targeting-safari-with-css-media-query
    @supports (hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none) {
        // line-clamp not working on Safari if element has children
        // https://stackoverflow.com/questions/70897195/line-clamp-webkit-not-working-in-safari/72170897#72170897
        * {
            display: inline;
        }

        > *::after {
            content: '\A\A';
            white-space: pre;
        }
    }

    &--hidden {
        display: none;
    }

    &--expanded {
        -webkit-line-clamp: initial;
    }
}

.toggle {
    .root--disabled + & {
        visibility: hidden;
    }
}
</style>
