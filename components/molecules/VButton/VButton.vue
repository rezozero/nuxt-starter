<script lang="ts">
import type { PropType } from 'vue'
import type { Theme } from '#imports'
import { NuxtLink } from '#components'

export const vButtonSizes = ['s', 'm', 'l'] as const
export type VButtonSize = (typeof vButtonSizes)[number]
export type Variant = 'menu' | 'anchor'

export const vButtonProps = {
    filled: Boolean,
    loading: Boolean,
    iconName: String,
    label: [String, Boolean] as PropType<string | false>,
    size: [String, Boolean] as PropType<VButtonSize | false>,
    elevated: Boolean,
    rounded: Boolean,
    outlined: Boolean,
    disabled: Boolean,
    tag: [String, Boolean] as PropType<string | false>,
    href: String,
    to: String,
    iconLast: {
        type: Boolean,
        default: true,
    },
    variant: String as PropType<Variant>,
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

        const linkProps = computed(() => {
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
                props.elevated && $style['root--elevated'],
                props.disabled && $style['root--disabled'],
                props.rounded && $style['root--rounded'],
                props.iconLast && $style['root--icon-last'],
                hasIcon.value && $style['root--has-icon'],
                hasLabel.value && $style['root--has-label'],
                props.loading && $style['root--loading'],
                props.variant && $style[`root--variant-${props.variant}`],
                typeof props.size === 'string' && $style[`root--size-${props.size}`],
                themeClass.value,
            ]
        })

        return {
            internalTag,
            linkProps,
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
        v-bind="linkProps"
    >
        <VSpinner v-if="hasIcon && loading" ref="icon" :class="$style.icon" />
        <VIcon v-else-if="iconName" :class="$style.icon" :name="iconName" />
        <slot v-else-if="hasIconSlot" ref="icon" :class="$style.icon" name="icon" />
        <span v-if="hasLabel" :class="$style.label">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<style lang="scss" module>
@use 'sass:map';

@if global-variable-exists('themes') {
    $themes: map.deep-merge(
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

    position: var(--v-button-position, relative);
    display: var(--v-button-display, inline-flex);
    align-items: center;
    justify-content: var(--v-button-justify-content, center);

    // Clear user-agent style
    border: initial;
    background-color: initial;
    color: var(--v-button-color, var(--theme-foreground-color));
    font-weight: var(--v-button-font-weight, 500);
    text-transform: var(--v-button-text-transform, none);

    // PROPS STYLE
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

    &--elevated {
        box-shadow: 0 2px 32px 0 rgba(#000, 0.1);
    }

    // button without background color / border
    &:not(.root--outlined, .root--filled) {
        --v-button-height: initial;
        --v-button-padding-inline: 0;
    }

    // LOADING
    &--loading {
        cursor: wait;
        pointer-events: none; // prevents click on disabled link (<a> or <nuxt-link>)
    }

    // DISABLED
    &[inert],
    &--disabled {
        color: var(--v-button-disabled-color, var(--theme-v-button-disabled-foreground));

        // prevents click on disabled link (<a> or <nuxt-link>)
        pointer-events: none;
    }

    &--outlined[inert],
    &--disabled#{&}--outlined {
        --v-button-outlined-border-color: var(--v-button-disabled-color, var(--theme-v-button-disabled-foreground));
    }

    &--filled[inert],
    &--disabled#{&}--filled {
        background: var(--theme-v-button-disabled-background);
    }

    // SIZES
    @each $key, $value in $v-button {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }

    // HOVER
    @media (hover: hover) {
    }

    // VARIANTS
    //&--variant-menu {
    //    @include v-button-css-vars-by-size($v-button-menu-rounded, 's', 'rounded');
    //    @include v-button-default-css-vars($v-button-menu);
    //
    //    @each $key, $value in $v-button-menu {
    //        &--size-#{$key} {
    //            @include v-button-size($key, menu);
    //        }
    //    }
    //}
}

// can't apply class to icon slot directly
// be aware than all nested svg are styled
.root svg,
.icon {
    @include v-button-default-css-vars($v-button-icon, 'icon');

    z-index: 1;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: var(--v-button-icon-color, currentColor);
    line-height: 0;
    rotate: var(--v-button-icon-rotate);
    transform-origin: center;
    transition: rotate 0.3s;

    .root--loading & {
        width: rem(24);
        height: rem(24);
    }
}

.label {
    @include v-button-default-css-vars($v-button-label, 'label');

    position: relative;
    display: var(--v-button-label-display);

    // center typo vertically
    margin-top: rem(-2);

    // hover
    text-decoration: var(--v-button-label-text-decoration);
    text-overflow: ellipsis;
    text-underline-offset: rem(3);
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
