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
const toggle = () => (isExpanded.value = !isExpanded.value)

const isDisabled = ref(props.lines === 0)

const contentElement = useTemplateRef('contentElement')
function updateDisabled() {
    const element = (contentElement.value as ComponentPublicInstance)?.$el as HTMLElement
    if (!element) return

    isDisabled.value = !isExpanded.value && element.scrollHeight <= element.clientHeight
}

onMounted(updateDisabled)
useResizeObserver(contentElement, updateDisabled)

const { t } = useI18n()
const ariaLabel = computed(() => {
    return isExpanded.value ? t('collapse_text') : t('expand_text')
})
</script>

<template>
    <VMarkdown
        :id="id"
        ref="contentElement"
        :class="[
            $style.content,
            isExpanded && $style['content--expanded'],
            lines === 0 && !isExpanded && $style['content--hidden'],
            ui?.content,
        ]"
        :content="content"
    />
    <slot
        :id="id"
        :toggle="toggle"
        :aria-label="ariaLabel"
        :is-expanded="isExpanded"
    >
        <VButton
            :aria-controls="id"
            :disabled="isDisabled"
            :class="[$style.toggle, ui?.toggle]"
            :aria-label="ariaLabel"
            :label="isExpanded ? $t('see_less') : $t('see_more')"
            @click="toggle"
        />
    </slot>
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
