<script lang="ts" setup>
import type { PropType } from 'vue'

const style = useCssModule()
const props = defineProps({
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
})

const classNames = computed(() => [
    style.root,
    props.focused && style['root--focused'],
    props.filled && style['root--filled'],
    props.disabled && style['root--disabled'],
    !props.inline && style['root--default'],
    props.inline && style['root--inline'],
    props.hideSeparator && style['root--hide-separator'],
])
</script>

<template>
    <component
        :is="tag"
        :class="classNames"
    >
        <div :class="$style.field">
            <label
                v-if="label"
                :class="$style.label"
                :for="id"
            >
                <slot name="beforeLabel" />{{ label }}<VRequiredMark v-if="required" /></label>
            <slot />
        </div>
        <p
            v-if="description"
            :class="$style.description"
        >
            {{ description }}
        </p>
        <div
            v-if="errors"
            :class="$style.errors"
        >
            <div
                v-for="(value, name, index) in errors"
                :key="index"
            >
                {{ value }}
            </div>
        </div>
    </component>
</template>

<style lang="scss" module>
.root {
    position: relative;

    &--disabled {
        opacity: 0.3;
    }

    & + & {
        margin-top: px-to-rem(16);
    }

    & + fieldset#{&} {
        margin-top: px-to-rem(32);
    }
}

.field {
    position: relative;
    display: grid;
    width: 100%;
    flex-wrap: wrap;
    align-items: start;
    padding-top: px-to-rem(18);
    padding-bottom: px-to-rem(14);
    border-bottom: 1px solid rgb(1 1 1 / 30%);
    transition: border-color 0.3s;

    .root--hide-separator & {
        padding: 0;
        border-bottom: none;
    }

    .root--focused &,
    .root--filled & {
        border-color: rgb(1 1 1);
    }
}

.label {
    position: relative;
    z-index: 2;
    display: flex;
    cursor: pointer;
    font-size: px-to-rem(20);
    grid-column: 1/-1;
    opacity: 0.5;
    pointer-events: none;
    user-select: none;

    &:has(input[type='checkbox']) {
        font-size: px-to-rem(16);
        opacity: 1;
    }

    .root--default > .field > & {
        display: block;
        grid-row: 1;
        transform-origin: 0 center;
        transition-duration: 0.2s;
        transition-property: transform, opacity;
        transition-timing-function: ease-out;
    }

    .root--inline & {
        display: inline;
        align-items: center;
        pointer-events: all;
    }

    .root--focused.root--inline & {
        text-decoration: underline;
    }

    .root--focused:not(.root--inline) &,
    .root--filled:not(.root--inline) & {
        transform: translate3d(0, -100%, 0) scale(0.7);
    }

    // .root--focused:not(.root--inline, .root--disabled) &,
    // .root--filled:not(.root--inline, .root--disabled) & {
    //     opacity: 0.5;
    // }
}

.description,
.errors {
    padding-top: px-to-rem(8);
    margin-top: 0;
    margin-bottom: px-to-rem(-5);
    font-size: px-to-rem(12);
    grid-column: 1/-1;
}

.description {
    opacity: 0.5;
}

.errors {
    color: rgb(244, 67, 54);
}
</style>
