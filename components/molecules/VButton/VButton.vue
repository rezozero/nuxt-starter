<script lang="ts">
import type { PropType } from 'vue'
import type { Theme } from '#imports'
import { NuxtLink } from '#components'

export const vButtonSizes = ['sm', 'md', 'lg', 'xl'] as const
export type VButtonSize = (typeof vButtonSizes)[number]

export type Variant = 'menu'

export const vButtonEmphasis = ['low', 'medium', 'high']
export type VButtonEmphasis = (typeof vButtonEmphasis)[number]

export const vButtonProps = {
    tag: [String, Boolean] as PropType<string | false>,
    iconName: String,
    label: [String, Boolean] as PropType<string | false>,
    href: String,
    to: String,
    iconLast: { type: Boolean, default: true },
    // state
    loading: Boolean,
    disabled: Boolean,
    // Style
    filled: Boolean,
    elevated: Boolean,
    rounded: Boolean,
    outlined: Boolean,
    // Vars
    size: [String, Boolean] as PropType<VButtonSize | false>,
    variant: String as PropType<Variant>,
    theme: [String, Boolean] as PropType<Theme | false>,
    emphasis: String as PropType<VButtonEmphasis>,
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
                props.iconLast && $style['root--icon-last'],
                hasLabel.value && $style['root--has-label'],
                hasIcon.value && $style['root--has-icon'],
                props.outlined && $style['root--outlined'],
                props.filled && $style['root--filled'],
                props.elevated && $style['root--elevated'],
                props.disabled && $style['root--disabled'],
                props.rounded && $style['root--rounded'],
                props.loading && $style['root--loading'],
                props.emphasis && $style[`root--emphasis-${props.emphasis}`],
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
        <VSpinner v-if="hasIcon && loading" ref="icon" :class="$style.icon" :size="24" />
        <VIcon v-else-if="iconName" :class="$style.icon" :name="iconName" />
        <slot v-else-if="hasIconSlot" ref="icon" :class="$style.icon" name="icon" />
        <span v-if="hasLabel" :class="$style.label">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<style lang="scss" module>
@use 'sass:list';
@use 'sass:map';

.root {
    @include v-button-css-vars($v-button);
    @include theme-variants;

    // PROPS STYLE
    &--icon-last {
        flex-direction: row-reverse;
    }

    &:where(#{&}--outlined, #{&}--filled, #{&}--rounded, #{&}--elevated) {
        @include v-button-css-vars($v-button-spacing);
    }

    &--rounded {
        @include v-button-css-vars($v-button-rounded, 'rounded');
    }

    &--outlined {
        @include v-button-css-vars($v-button-outlined, 'outlined');
    }

    &--filled {
        @include v-button-css-vars($v-button-filled, 'filled');
    }

    &--elevated {
        box-shadow: 0 2px 32px 0 rgba(#000, 0.1);
    }

    &--loading {
        cursor: wait;
        pointer-events: none; // prevents click on disabled link (<a> or <nuxt-link>)
    }

    &:not(:where([inert], #{&}--disabled)) {
        cursor: var(--v-button-cursor, pointer);
    }

    // DISABLED
    &:where([inert], #{&}--disabled) {
        color: var(--v-button-disabled-color, lightgray);

        // prevents click on disabled link (<a> or <nuxt-link>)
        pointer-events: none;
    }

    // SIZES
    @each $key, $value in $v-button {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }

    // EMPHASIS
    @each $emphasis-key, $vars in $v-button-emphasis {
        &--emphasis-#{$emphasis-key} {
            @include v-button-variant-css-vars($v-button-emphasis, $emphasis-key);
        }

        // Get available sizes from emphasis vars
        $available-sizes: '';

        @each $item in $vars {
            $var-content: map.get($item, 'vars');

            @each $size-key, $val in $var-content {
                @if $size-key != 'common' and list.index($available-sizes, $size-key) == null {
                    $available-sizes: append($available-sizes, $size-key);
                }
            }
        }

        // Set css var by size
        @each $size in $available-sizes {
            &--emphasis-#{$emphasis-key}.root--size-#{$size} {
                @include v-button-size($size, $emphasis-key);
            }
        }

        // Wait for Theme PR to add
        // Add filtered emphasis css var theme
        //@each $theme-key, $value in $themes {
        //    &--emphasis-#{$emphasis-key}.root--theme-#{$theme-key} {
        //        @include theme($theme-key, $match: 'buttons-#{$emphasis-key}');
        //    }
        //}
    }

    // VARIANT
    @each $variant-key, $vars in $v-button-variants {
        &--variant-#{$variant-key} {
            @include v-button-variant-css-vars($v-button-variants, $variant-key);
        }

        $available-sizes: '';

        @each $item in $vars {
            $var-content: map.get($item, 'vars');

            @each $size-key, $val in $var-content {
                @if $size-key != 'common' and list.index($available-sizes, $size-key) == null {
                    $available-sizes: append($available-sizes, $size-key);
                }
            }
        }

        @each $size in $available-sizes {
            &--variant-#{$variant-key}.root--size-#{$size} {
                @include v-button-size($size, $variant-key);
            }
        }

        // Wait for Theme PR to add
        // Add filtered emphasis css var theme
        //@each $theme-key, $value in $themes {
        //    &--variant-#{$emphasis-key}.root--theme-#{$theme-key} {
        //        @include theme($theme-key, $match: 'buttons-#{$emphasis-key}');
        //    }
        //}
    }
}

// be aware than all nested svg are styled
.root svg,
.icon {
    @include v-button-css-vars($v-button-icon, 'icon');
}

.label {
    @include v-button-css-vars($v-button-label, 'label');
}
</style>
