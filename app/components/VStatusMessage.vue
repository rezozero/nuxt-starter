<script lang="ts" setup>
const props = defineProps<{
    status: 'success' | 'warning' | 'error' | 'neutral'
    iconName?: string
    title?: string
    message: string
}>()

const iconName = computed(() => {
    if (props.iconName) return props.iconName
    else if (props.status === 'success') return 'form-success-circle'
    else if (props.status === 'warning') return 'form-exclamation-triangle'
    else if (props.status === 'error') return 'form-exclamation-circle'
    return undefined
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        props.title ? $style['root--layout-default'] : $style['root--layout-condensed'],
        $style[`root--${props.status}`],
    ]
})
</script>

<template>
    <div :class="rootClasses">
        <VIcon
            v-if="iconName"
            :name="iconName"
            :class="$style.icon"
            size="1.5rem"
        />
        <VMarkdown
            v-if="title"
            :class="$style.title"
            :content="title"
            inline
            tag="h4"
        />
        <VMarkdown
            v-if="message"
            :content="message"
            :class="$style.message"
            inline
            tag="p"
            class="text-body-xs"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    display: grid;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid var(--v-status-message-border-color);
    border-radius: var(--radius-2xs, 4px);
    background-color: var(--v-status-message-background-color);
    color: var(--v-status-message-color, currentColor);
    column-gap: 8px;
    grid-template-areas:
        'icon title'
        '. content';
    grid-template-columns: auto 1fr;

    &:not(:has(.title)) {
        border: none;
        grid-template-areas: 'icon content';
    }

    &:has(.link) {
        padding-bottom: 0;
    }

    &--success {
        --v-status-message-border-color: var(--status-success-on-container, #166a44);
        --v-status-message-background-color: var(--status-success-container, rgb(35 169 108 / 15%));
        --v-status-message-color: var(--status-success-on-container, #166a44);
    }

    &--warning {
        --v-status-message-border-color: var(--status-warning-on-container, #c32b09);
        --v-status-message-background-color: var(--status-warning-container, rgb(246 95 63 / 15%));
        --v-status-message-color: var(--status-warning-on-container, #c32b09);
    }

    &--error {
        --v-status-message-border-color: var(--status-alert-on-container, #b31926);
        --v-status-message-background-color: var(--status-alert-container, rgb(230 76 89 / 15%));
        --v-status-message-color: var(--status-alert-on-container, #b31926);
    }
}

.icon {
    font-size: 24px;
    grid-area: icon;
}

.title {
    color: var(--v-status-message-color, currentColor);
    grid-area: title;
    margin-block: 0;
}

.message {
    color: var(--v-status-message-color, currentColor);
    grid-area: content;
    margin-block: 0;

    & > *:first-child {
        padding-top: 0;
        margin-top: 0;
    }

    & > *:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
    }

    .title + & {
        margin-top: var(--spacing-5xs, 4px);
    }
}
</style>
