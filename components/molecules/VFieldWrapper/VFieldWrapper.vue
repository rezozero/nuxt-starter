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

<script setup lang="ts">
import type { PropType } from 'vue'
import VRequiredMark from '~/components/atoms/VRequiredMark/VRequiredMark.vue'

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

const classnames = computed(() => [
    style.root,
    props.focused && style['root--focused'],
    props.filled && style['root--filled'],
    props.disabled && style['root--disabled'],
    !props.inline && style['root--default'],
    props.inline && style['root--inline'],
    props.hideSeparator && style['root--hide-separator'],
])
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

    // .root--default > .field > & {
    //    position: absolute;
    //    top: 0;
    //    display: block;
    //    font-weight: bold;
    //    transform-origin: 0 center;
    //    transition: all 0.2s ease-out;
    //}

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

    // .root--focused:not(.root--inline) &,
    // .root--filled:not(.root--inline) & {
    //    opacity: 0.5;
    //    transform: translate3d(0, #{rem(-20)}, 0) scale(0.7);
    //}
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
