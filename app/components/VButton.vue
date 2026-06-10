<script lang="ts">
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { NuxtLink } from '#components'
import type { Theme } from '~~/types/theme'

export const vButtonDesign = ['outlined'] as const
export type VButtonDesign = (typeof vButtonDesign)[number]

export const vButtonSizes = ['xs', 'sm', 'md', 'lg'] as const
export type VButtonSize = (typeof vButtonSizes)[number]

export const vButtonProps = {
    tag: [String, Boolean] as PropType<string | false>,
    iconName: String,
    label: [String, Boolean] as PropType<string | false>,
    to: [Object, String] as PropType<RouteLocationRaw>,
    href: [Object, String] as PropType<RouteLocationRaw>, // alias for `to` (same as <NuxtLink>)
    iconLast: { type: Boolean, default: true },
    iconClass: [String, Array] as PropType<string | false | undefined | (string | false | undefined)[]>,
    labelClass: String,
    disabled: Boolean,
    size: [String, Boolean] as PropType<VButtonSize | false>,
    theme: [String, Boolean] as PropType<Theme | false>,
    design: [String, Boolean] as PropType<VButtonDesign | false>,
}

export default defineComponent({
    props: vButtonProps,
    setup(props, { slots, attrs }) {
        const internalTag = computed(() => {
            if (typeof props.tag === 'string') return props.tag
            else if (props.to || props.href) return NuxtLink
            else return 'button'
        })
        const internalTarget = computed(() => {
            if (typeof attrs.target === 'string') return attrs.target

            const url = typeof props.to === 'string' ? props.to : typeof props.href === 'string' ? props.href : ''

            if (!url || !isExternalUrl(url)) return

            return '_blank'
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
                props.disabled && $style['root--disabled'],
                typeof props.size === 'string' && $style[`root--size-${props.size}`],
                typeof props.design === 'string' && $style[`root--design-${props.design}`],
                themeClass.value,
            ]
        })

        return {
            internalTag,
            internalTarget,
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
        :to="to"
        :href="href"
        :target="internalTarget"
        :disabled="internalTag === 'button' && disabled ? true : undefined"
    >
        <slot
            name="icon"
            :item-class="[$style.icon, iconClass]"
        >
            <VIcon
                v-if="iconName"
                :class="[$style.icon, iconClass]"
                :name="iconName"
            />
        </slot>
        <span
            v-if="hasLabel"
            :class="[$style.label, labelClass]"
        >
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<style lang="scss" module>
@use 'assets/scss/components/v-button';
@use 'assets/scss/components/v-button-outlined';

.root {
    display: var(--v-button-display, inline-flex);
    align-items: var(--v-button-align-items, center);
    justify-content: var(--v-button-justify-content, center);
    font-family: var(--v-button-font-family, inherit);

    @include theme-variants('button-');

    // Default styles
    @include v-button.apply;
    @include v-button.size-classes;

    &--icon-last {
        flex-direction: row-reverse;
    }

    &:not(:where([inert], #{&}--disabled)) {
        cursor: var(--v-button-cursor, pointer);
    }

    // DISABLED
    &:where([inert], #{&}--disabled, [disabled]) {
        color: var(--v-button-disabled-color, lightgray);
        pointer-events: none; // prevents click on disabled link (<a> or <nuxt-link>)
    }

    @at-root {
        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(button#{&}),
        :where(a#{&}:link),
        :where(a#{&}:where(:visited)) {
            color: inherit;
        }

        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(button#{&}){
            text-align: inherit;
            user-select: none;
        }
    }

    &--design-outlined {
        @include v-button-outlined.apply;
    }

    @include v-button-outlined.size-classes;
}

.icon {
    flex-shrink: var(--v-button-icon-flex-shrink, 0);
    color: var(--v-button-icon-color, currentColor);

    @include v-button.apply('icon');

    .root--design-outlined & {
        @include v-button-outlined.apply('icon')
    }
}

.label {
    overflow: var(--v-button-label-overflow, hidden);
    text-overflow: var(--v-button-label-text-overflow, ellipsis);
    white-space: var(--v-button-label-white-space, nowrap);

    @include v-button.apply('label');

    .root--design-outlined & {
        @include v-button-outlined.apply('label')
    }
}
</style>
