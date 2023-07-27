<template>
    <component
        :is="internalTag"
        :class="classNames"
        :disabled="internalTag === 'button' && disabled"
        v-bind="linkProps"
        :inert="disabled"
        @click="onClick"
    >
        <span v-if="hasIcon" ref="icon" :class="$style.icon">
            <slot name="icon" />
        </span>
        <span v-if="hasLabel" :class="$style.label">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue/types/options'
import mixins from 'vue-typed-mixins'
import Themeable from '~/mixins/Themeable'

type Size = 's' | 'm' | 'l'

function isRelativePath(path: string): boolean {
    return path.charAt(0) === '/'
}

export default mixins(Themeable).extend({
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
        href: [String, Boolean] as PropType<string | false>, // external (absolute) or internal (relative) link
        to: [String, Object, Boolean], // internal link (use NuxtLink)
        iconLast: { type: Boolean, default: true },
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
                this.hasIcon && this.$style['root--has-icon'],
                this.hasLabel && this.$style['root--has-label'],
                this.iconLast && this.$style['root--icon-last'],
                typeof this.size === 'string' && this.$style['root--size-' + this.size],
                this.themeClass,
            ]
        },
        internalTag(): string {
            if (typeof this.tag === 'string') return this.tag

            if (this.to || (typeof this.href === 'string' && isRelativePath(this.href))) return 'nuxt-link'
            else if (this.href) return 'a'
            else return 'button'
        },
        hasIcon(): boolean {
            return !!this.$slots.icon || !!this.$scopedSlots.icon
        },
        hasLabel(): boolean {
            return !!this.$slots.default || !!this.$scopedSlots.default || !!this.label
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

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: var(--theme-foreground-color);
    text-align: left;
    text-decoration: none;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &--rounded {
        @include v-button-default-css-vars($v-button-rounded, 'rounded');

        border-radius: rem(40);
    }

    &--outlined {
        border-width: var(--v-button-border-width, 3px);
        border-style: solid;
        border-color: var(--v-button-border-color, currentColor);
    }

    &--filled {
        background-color: var(--theme-foreground-color);
        color: var(--theme-background-color);
    }

    &:not(#{&}--outlined):not(#{&}--filled),
    &--icon {
        padding: 0;
    }

    &--elevated {
        box-shadow: 0 2px 32px 0 rgba(#000, 0.1);
    }

    // DISABLED

    &--disabled {
        color: color(grey-50) !important;
    }

    &--outlined#{&}--disabled {
        background-color: transparent;
    }

    &--filled#{&}--disabled {
        background-color: color(grey-10);
    }

    // HOVER

    //@media (hover: hover) {
    //    &--outlined:not(#{&}--disabled):hover {
    //    }
    //
    //    &--filled:not(#{&}--disabled):hover {
    //    }
    //}

    // SIZES

    @each $key, $value in $v-button {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }
}

.icon {
    @include v-button-default-css-vars($v-button-icon, 'icon');

    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v-button-icon-color, currentColor);
    line-height: 0;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    .root--icon-last & {
        order: 2;
    }
}

.label {
    @include v-button-default-css-vars($v-button-label, 'label');

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
