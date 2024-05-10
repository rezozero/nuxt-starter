<script lang="ts">
import type { PropType } from 'vue'
import type { Theme } from '#imports'
import { NuxtLink } from '#components'

export type VButtonSize = 's' | 'm' | 'l' | 'xl'

export const vButtonProps = {
    filled: Boolean,
    label: [String, Boolean] as PropType<string | false>,
    size: [String, Boolean] as PropType<VButtonSize | false>,
    rounded: Boolean,
    outlined: Boolean,
    disabled: Boolean,
    tag: [String, Boolean] as PropType<string | false>,
    href: String,
    to: String,
    iconName: [String, Boolean] as PropType<string | false>,
    iconLast: {
        type: Boolean,
        default: true,
    },
    theme: [String, Boolean] as PropType<Theme | false>,
}

export default defineComponent({
    props: vButtonProps,
    setup(props, { slots, attrs }) {
        const url = computed(() => props.href || props.to)
        const isRelativePath = computed(() => url.value?.charAt(0) === '/')
        const internalTag = computed((): string | typeof NuxtLink => {
            if (typeof props.tag === 'string') return props.tag

            // a target on a link could be used to deactivate the NuxtLink
            if (isRelativePath.value && typeof attrs.target !== 'string') return NuxtLink
            else if (props.href) return 'a'
            else return 'button'
        })
        const internalProps = computed(() => {
            const result: Record<string, any> = {}

            // If the tag is forced to be a link <a>, then it shouldn't have a `to` prop (`to` is for NuxtLink component)
            if (isRelativePath.value && internalTag.value !== 'a') {
                result.to = url.value
            } else if (props.href) {
                result.href = props.href
            }

            return result
        })
        const hasIconSlot = computed(() => !!slots.icon)
        const hasIcon = computed(() => hasIconSlot.value || !!props.iconName)
        const hasLabel = computed(() => !!slots.default || !!props.label)
        const { themeClass } = useTheme({ props })
        const $style = useCssModule()
        const rootClasses = computed(() => {
            return [
                $style.root,
                props.outlined && $style['root--outlined'],
                props.filled && $style['root--filled'],
                props.disabled && $style['root--disabled'],
                props.rounded && $style['root--rounded'],
                props.iconLast && $style['root--icon-last'],
                hasIcon.value && $style['root--has-icon'],
                hasLabel.value && $style['root--has-label'],
                typeof props.size === 'string' && $style[`root--size-${props.size}`],
                themeClass.value,
            ]
        })

        return {
            internalTag,
            internalProps,
            hasIconSlot,
            hasIcon,
            hasLabel,
            rootClasses,
        }
    },
})
</script>

<template>
    <component
        :is="internalTag"
        :class="rootClasses"
        :disabled="(internalTag === 'button' && disabled) || undefined"
        v-bind="internalProps"
    >
        <slot v-if="hasIconSlot" ref="icon" name="icon" />
        <VIcon v-else-if="iconName" :class="$style.icon" :name="iconName" />
        <span v-if="hasLabel" :class="$style.label">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<style lang="scss" module>
@if global-variable-exists('themes') {
    $themes: map-merge(
        $themes,
        (
            dark: (
                v-button-disabled-color: #757575,
                v-button-disabled-foreground: #757575,
                v-button-disabled-background: #e3e3e3,
            ),
            light: (
                v-button-disabled-foreground: #9f9f9f,
                v-button-disabled-background: #e3e3e3,
                v-button-disabled-outlined: #9f9f9f,
            ),
        )
    );
}

.root {
    @include v-button-default-css-vars($v-button);
    @include theme-variants;

    display: var(--v-button-display, inline-flex);
    align-items: center;
    justify-content: var(--v-button-justify-content, center);
    backface-visibility: hidden;
    color: var(--v-button-color, var(--theme-foreground-color));
    text-transform: var(--v-button-text-transform, none);
    transition:
        background-color 0.3s,
        color 0.3s;

    &--icon-last {
        flex-direction: row-reverse;
    }

    &--rounded {
        @include v-button-default-css-vars($v-button-rounded, 'rounded');
    }

    &--outlined {
        @include v-button-default-css-vars($v-button-outlined, 'outlined');
    }

    &--filled {
        @include v-button-default-css-vars($v-button-filled, 'filled');
    }

    // button without background color / border
    &:not(.root--outlined, .root--filled) {
        --v-button-padding-inline: 0;
    }

    // DISABLED
    &[inert],
    &--disabled {
        color: var(--v-button-disabled-color, var(--theme-v-button-disabled-foreground));

        // prevents click on disabled link (<a> or <nuxt-link>)
        pointer-events: none;
    }

    // SIZES
    @each $key, $value in $v-button {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }

    // HOVER
    // @media (hover: hover) {
    // }
}

// can't apply class to icon slot directly
// be aware than all nested svg are styled
.root svg,
.icon {
    @include v-button-default-css-vars($v-button-icon, 'icon');

    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: var(--v-button-icon-color, currentColor);
    line-height: 0;
}

.label {
    @include v-button-default-css-vars($v-button-label, 'label');

    display: var(--v-button-label-display);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    // button with icon at first position and without background color / border
    .root:not(.root--icon-last, .root--outlined, .root--filled) & {
        margin-right: 0;
    }

    // button with icon at last position and without background color / border
    .root--icon-last:not(.root--outlined, .root--filled) & {
        margin-left: 0;
    }
}
</style>
