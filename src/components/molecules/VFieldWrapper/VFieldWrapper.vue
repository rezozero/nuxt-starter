<template>
    <component :is="tag" :class="classnames">
        <div :class="$style.field">
            <label v-if="label" :class="$style.label" :for="id">
                <slot name="beforeLabel" />
                {{ label }} <v-required-mark v-if="required" />
            </label>
            <slot />
        </div>
        <p v-if="description" :class="$style.description">{{ description }}</p>
        <div v-if="errors" :class="$style.errors">
            <div v-for="(value, name, index) in errors" :key="index">{{ value }}</div>
        </div>
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VFieldWrapper',
    inheritAttrs: false,
    props: {
        id: String,
        errors: Object as PropType<Record<string, string>>,
        label: [String, Boolean],
        required: Boolean,
        inline: Boolean,
        hideSeparator: Boolean,
        focused: Boolean,
        active: Boolean,
        filled: Boolean,
        disabled: Boolean,
        description: [String, Boolean],
        tag: {
            type: String,
            default: 'div',
        },
    },
    computed: {
        classnames(): Array<string | boolean> {
            return [
                this.$style.root,
                this.focused && this.$style['root--focused'],
                this.filled && this.$style['root--filled'],
                this.disabled && this.$style['root--disabled'],
                !this.inline && this.$style['root--default'],
                this.inline && this.$style['root--inline'],
                this.hideSeparator && this.$style['root--hide-separator'],
            ]
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    padding: rem(28) 0 rem(16);

    &--hide-separator {
        padding: 0;
        border-bottom: none;
    }
}

.field {
    position: relative;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
}

.label {
    position: relative;
    z-index: 2;
    display: flex;
    cursor: pointer;
    pointer-events: none;
    user-select: none;

    .root--default > .field > & {
        position: absolute;
        top: 0;
        display: block;
        font-weight: bold;
        transform-origin: 0 center;
        transition: all 0.2s ease-out;
    }

    .root--disabled & {
        opacity: 0.3;
    }

    .root--inline & {
        display: flex;
        align-items: center;
        pointer-events: all;
    }

    .root--focused.root--inline & {
        text-decoration: underline;
    }

    .root--focused:not(.root--inline) &,
    .root--filled:not(.root--inline) & {
        opacity: 0.5;
        transform: translate3d(0, #{rem(-20)}, 0) scale(0.7);
    }
}

.description,
.errors {
    padding: rem(8) 0 0;
    margin: 0 0 rem(-5);
}

.description {
    opacity: 0.5;
}

.errors {
    color: red;
}
</style>
