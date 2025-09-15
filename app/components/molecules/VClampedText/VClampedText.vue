<script setup lang="ts">
import type { ComponentPublicInstance, PropType } from 'vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    lines: {
        type: Number,
        default: 3,
    },
    ui: {
        type: Object as PropType<{ content?: string, toggle?: string }>,
    },
})

const id = useId()

const isExpanded = ref(false)
const isDisabled = ref(props.lines === 0)
const contentEl = useTemplateRef('contentEl')

function updateDisabled() {
    const element = (contentEl.value as ComponentPublicInstance)?.$el as HTMLElement

    if (!contentEl) return

    isDisabled.value = !isExpanded.value && element.scrollHeight <= element.clientHeight
}

onMounted(updateDisabled)
useResizeObserver(contentEl, updateDisabled)
</script>

<template>
    <VMarkdown
        :id="id"
        ref="contentEl"
        :class="[
            $style.content,
            isExpanded && $style['content--expanded'],
            lines === 0 && !isExpanded && $style['content--hidden'],
            ui?.content,
        ]"
        :content="content"
    />
    <VButton
        :aria-controls="id"
        :disabled="isDisabled"
        :class="[$style.toggle, ui?.toggle]"
        :aria-label="isExpanded ? $t('collapse_text') : $t('expand_text')"
        :label="isExpanded ? $t('see_less') : $t('see_more')"
        @click="isExpanded = !isExpanded"
    />
</template>

<style lang="scss" module>
.content {
    display: -webkit-box;
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
    &[disabled] {
        visibility: hidden;
    }
}
</style>
