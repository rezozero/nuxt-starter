<script lang="ts" setup>
const props = defineProps<{
    status: 'success' | 'warning' | 'error' | 'neutral'
    iconName?: string
    title?: string
    message: string
}>()

const iconName = computed(() => {
    if (props.iconName) return props.iconName
    else if (props.status === 'success') return 'check'
    else if (props.status === 'warning') return 'form-exclamation-triangle'
    else if (props.status === 'error') return 'form-exclamation-circle'
    return undefined
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        props.title ? $style['root--layout-default'] : $style['root--layout-condensed'],
        $style[`root--status-${props.status}`],
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
        <div
            v-if="title"
            :class="$style.title"
        >
            {{ title }}
        </div>
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
    display: flex;

    &--layout-default {
        flex-direction: column;
        padding: var(--spacing-4xs, 8px);
    }

    &--layout-condensed {
        flex-direction: row;
        align-items: center;
        padding: var(--spacing-6xs, 4px) var(--spacing-4xs, 8px);
        gap: var(--spacing-6xs, 4px);
    }

    &--status-success {
        color: var(--colors-form-state-success, #31b29b);
    }

    &--status-warning {
        color: var(--colors-form-state-warning, #f6603f);
    }

    &--status-error {
        background-color: var(--colors-form-state-alert-bg, rgba(225, 64, 64, 0.10));
        color: var(--colors-form-state-alert, #E14040);
    }

    &--status-neutral {
        background-color: var(--colors-surface-tertiary, #F5F5F5);
    }
}

.icon {
    flex-shrink: 0;
}

.title {
    margin-top: var(--spacing-6xs, 4px);
}

.message {
    > *:last-child {
        margin-bottom: 0;
    }

    .root--layout-default & {
        margin-top: var(--spacing-2xs, 12px);
    }
}
</style>
