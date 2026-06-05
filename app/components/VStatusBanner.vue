<script lang="ts" setup>
const props = defineProps<{
    status: 'success' | 'warning' | 'error'
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
        />
    </div>
</template>

<style lang="scss" module>
.root {
    display: grid;
    align-items: center;
    padding: var(--v-status-banner-padding, 10px 12px);
    border: 1PX solid var(--v-message-box-border-color, #cdcdcd);
    border-radius: var(--radius-xs, 4px);
    background-color: var(--v-message-box-background-color);
    color: var(--v-message-box-color, currentColor);
    column-gap: 8px;
    grid-template-areas:
        'icon title'
        '. content';
    grid-template-columns: auto 1fr;

    &:not(:has(.title)) {
        grid-template-areas: 'icon content';
    }

    &:has(.link) {
        padding-bottom: 0;
    }

    &:has(.icon) {
        padding: var(--v-status-banner-padding, 10px 18px 10px 8px);
    }

    &--success {
        --v-message-box-border-color: var(--status-on-container, #217868);
        --v-message-box-background-color: var(--status-success-background, rgb(49, 178, 155, 15%));
        --v-message-box-color: var(--status-success-on-container, #217868);
    }

    &--warning {
        --v-message-box-border-color: var(--status-on-container, #F6793F);
        --v-message-box-background-color: var(--status-warning-background, rgb(246, 121, 63, 15%));
        --v-message-box-color: var(--status-warning-on-container, #C84609);
    }

    &--error {
        --v-message-box-border-color: var(--status-on-container, #B11B1B);
        --v-message-box-background-color: var(--status-error-background, rgb(225, 64, 64, 15%));
        --v-message-box-color: var(--status-error-on-container, #B11B1B);
    }
}

.icon {
    font-size: 24px;
    grid-area: icon;
}

.title {
    font-weight: 600; /* Override text-overtitle-xs weight */
    grid-area: title;
    margin-block: 0;

}

.message {
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
        margin-top: var(--spacing-5xs);
    }
}
</style>
