<script lang="ts">
import type { PropType } from 'vue'
import type { Theme } from '#imports'
import { NuxtLink } from '#components'
import type { PossibleRoutePath } from '~/composables/use-path-link-parser'

export const vButtonSizes = ['sm', 'md', 'lg', 'xl'] as const
export type VButtonSize = (typeof vButtonSizes)[number]

export type Variant = 'menu'

export const vButtonEmphasis = ['low', 'medium', 'high']
export type VButtonEmphasis = (typeof vButtonEmphasis)[number]

export const vButtonProps = {
    tag: [String, Boolean] as PropType<string | false>,
    iconName: String,
    label: [String, Boolean] as PropType<string | false>,
    to: [String, Object] as PropType<PossibleRoutePath>,
    iconLast: { type: Boolean, default: true },
    // state
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
    setup(props, { slots }) {
        const { isRelative, isExternal, url } = usePathLinkParser(props.to)

        const internalTag = computed(() => {
            if (typeof props.tag === 'string') return props.tag

            // Let NuxtLink handle external link
            if (isRelative.value || isExternal.value) return NuxtLink
            else return 'button'
        })

        const linkProps = computed(() => {
            const result: Record<string, unknown> = {
                to: url.value,
            }

            if (isExternal.value) result.target = '_blank'

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
        <VIcon
            v-if="iconName"
            :class="$style.icon"
            :name="iconName"
        />
        <slot
            v-else-if="hasIconSlot"
            ref="icon"
            :class="$style.icon"
            name="icon"
        />
        <span
            v-if="hasLabel"
            :class="$style.label"
        >
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
                @if $size-key != 'common' and not list.index($available-sizes, $size-key) {
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
        // @each $theme-key, $value in $themes {
        //    &--emphasis-#{$emphasis-key}.root--theme-#{$theme-key} {
        //        @include theme($theme-key, $match: 'buttons-#{$emphasis-key}');
        //    }
        // }
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
                @if $size-key != 'common' and not list.index($available-sizes, $size-key) {
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
        // @each $theme-key, $value in $themes {
        //    &--variant-#{$emphasis-key}.root--theme-#{$theme-key} {
        //        @include theme($theme-key, $match: 'buttons-#{$emphasis-key}');
        //    }
        // }
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
