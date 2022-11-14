<template>
    <component
        :is="internalTag"
        :class="classNames"
        :disabled="internalTag === 'button' && disabled"
        v-bind="linkProps"
        @click="onClick"
    >
        <span ref="inner" :class="$style.inner">
            <span v-if="$slots.icon || $scopedSlots.icon" :class="$style.icon">
                <slot name="icon" />
            </span>
            <span v-if="$slots.default || $scopedSlots.default || label" :class="$style.label">
                <slot>{{ label }}</slot>
            </span>
        </span>
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropType } from 'vue/types/options'

type Size = 's' | 'm' | 'l'
type Theme = 'light' | 'dark'
type Color = 'primary' | 'secondary'
type Direction = 'ltr' | 'rtl'

function isRelativePath(path: string): boolean {
    return path.charAt(0) === '/'
}

export default Vue.extend({
    name: 'VButton',
    props: {
        filled: Boolean,
        label: [String, Boolean] as PropType<string | false>,
        size: [String, Boolean] as PropType<Size | false>,
        elevated: Boolean,
        rounded: Boolean,
        outlined: Boolean,
        disabled: Boolean,
        tag: [String, Boolean] as PropType<string | false>,
        theme: [String, Boolean] as PropType<Theme | false>,
        color: [String, Boolean] as PropType<Color | false>,
        direction: {
            type: [String, Boolean] as PropType<Direction | false>,
            validator(value): boolean {
                return (typeof value === 'string' && ['ltr', 'rtl'].includes(value)) || typeof value === 'boolean'
            },
        },
        href: [String, Boolean] as PropType<string | false>, // external (absolute) or internal (relative) link
        to: [String, Object, Boolean], // internal link (use NuxtLink)
    },
    computed: {
        classNames(): (string | boolean | undefined)[] {
            return [
                this.$style.root,
                this.outlined && this.$style['root--outlined'],
                this.filled && this.$style['root--filled'],
                this.elevated && this.$style['root--elevated'],
                this.disabled && this.$style['root--disabled'],
                this.rounded && this.$style['root--rounded'],
                !this.$slots.default && !this.$scopedSlots.default && !this.label && this.$style['root--icon'],
                this.direction === 'rtl' && this.$style['root--rtl'],
                typeof this.size === 'string' && this.$style['root--size-' + this.size],
                typeof this.theme === 'string' && this.$style['root--theme-' + this.theme],
                typeof this.color === 'string' && this.$style['root--color-' + this.color],
            ]
        },
        internalTag(): string {
            if (typeof this.tag === 'string') return this.tag

            if (this.to || (typeof this.href === 'string' && isRelativePath(this.href))) return 'nuxt-link'
            else if (this.href) return 'a'
            else return 'button'
        },
        linkProps(): Record<string, any> {
            const props: Record<string, any> = {}

            if (this.to) {
                props.to = this.to
            } else if (typeof this.href === 'string' && isRelativePath(this.href)) {
                props.to = this.href
            } else if (this.href) {
                props.href = this.href
                props.target = '_blank'
            }

            return props
        },
    },
    methods: {
        onClick(event: MouseEvent) {
            this.$emit('click', event)
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

.root {
    @include v-button-default-css-vars($v-button);
    @include theme-variants;

    display: inline-block;
    border: none;
    color: inherit;
    font-weight: bold;
    text-decoration: none;
    transition: background-color 0.3s;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &--disabled {
        pointer-events: none; // prevents click on disabled link (<a> or <nuxt-link>)
    }

    &--rounded {
        @include v-button-default-css-vars($v-button-rounded, '-rounded');
    }

    &--color-primary {
        color: var(--theme-primary);
    }

    &--color-secondary {
        color: var(--theme-secondary);
    }

    &--filled {
        background-color: var(--theme-default);
        color: var(--theme-on-default);
    }

    &--filled#{&}--disabled {
        background-color: rgba(#000, 0.2);
        color: rgba(#000, 0.7);
    }

    &:not(#{&}--filled)#{&}--disabled {
        color: rgba(#000, 0.7);
    }

    &--outlined#{&}--disabled {
        background-color: transparent;
        color: rgba(#000, 0.3);
    }

    &--filled#{&}--color-primary {
        background-color: var(--theme-primary);
        color: var(--theme-on-primary);
    }

    &--filled#{&}--color-secondary {
        background-color: var(--theme-secondary);
        color: var(--theme-on-secondary);
    }

    &--elevated {
        box-shadow: 0 2px 32px 0 rgba(#000, 0.1);
    }

    // sizes
    $vars: map-remove($v-button, default);

    @each $key, $value in $vars {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }
}

.inner {
    @include v-button-default-css-vars($v-button-inner, '-inner');

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;

    .root:not(.root--outlined):not(.root--filled) & {
        padding: 0;
    }

    .root--icon & {
        padding: 0;
    }

    .root--outlined & {
        border-width: var(--v-button-border-width, 3px);
        border-style: solid;
        border-radius: inherit;
        transition: all 0.3s;
    }

    .root--outlined.root--color-primary & {
        border-color: var(--theme-primary);
    }

    .root--outlined.root--color-secondary & {
        border-color: var(--theme-secondary);
    }
}

.icon {
    @include v-button-default-css-vars($v-button-icon, '-icon');

    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    transition: color 0.3s, transform 0.3s;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    .root:not(.root--rtl) &:first-child {
        margin-left: 0;
    }

    &:first-child:last-child {
        margin: 0;
    }

    .root--rtl & {
        order: 2;
        margin-right: 0;
    }
}

.label {
    @include v-button-default-css-vars($v-button-label, '-label');
}
</style>
