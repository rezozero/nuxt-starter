<script lang="ts" setup>
import type { FormElementProps } from '~/types/form'

export interface InputListOption {
    label?: string
    value: string
    required?: boolean
}

interface Props extends FormElementProps {
    options?: InputListOption[]
    multiple?: boolean
    legend?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['input', 'update:modelValue'])

function onOptionInput(inputValue: InputListOption['value']) {
    const currentValue = props.modelValue
    let newValue = null

    if (Array.isArray(currentValue)) {
        newValue = currentValue.includes(inputValue)
            ? currentValue.filter(v => v !== inputValue)
            : [...currentValue, inputValue]
    }
    else {
        newValue = currentValue === inputValue ? null : inputValue
    }

    emit('update:modelValue', newValue)
}

// If component has required props, at least one input should be valid
const valueFilled = computed(() => {
    return !!(Array.isArray(props.modelValue) ? props.modelValue.length : props.modelValue)
})
const displayRequiredGroupInput = computed(() => props.required && !valueFilled.value)
</script>

<template>
    <VFieldWrapper
        :id="id"
        :class="[$style.root, disabled && $style['root--disabled'], errors && $style['root--errors']]"
        :description="false"
        :disabled="disabled"
        :label="false"
        :required="required"
        :hide-separator="hideSeparator"
        tag="fieldset"
    >
        <legend
            v-if="label"
            :class="$style.legend"
        >
            {{ label }}
            <VRequiredMark v-if="required" />
        </legend>
        <input
            v-if="displayRequiredGroupInput"
            :class="$style['input-group-validation']"
            required
            type="checkbox"
        >
        <p
            v-if="description"
            :class="$style.description"
        >
            {{ description }}
        </p>
        <div
            v-for="option in options"
            :key="option.value"
            :class="$style['input-wrapper']"
        >
            <VInput
                :id="id + '-' + option.value"
                v-model="option.value"
                :disabled="disabled"
                :label="option.label"
                :name="`${name}[]`"
                :required="option.required"
                :type="multiple ? 'checkbox' : 'radio'"
                hide-separator
                @input="onOptionInput(option.value)"
            />
        </div>
    </VFieldWrapper>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

.input-group-validation {
    all: revert;
    position: absolute;
    left: 50%;
    opacity: 0;
    pointer-events: none;
}

.root {
    display: flex;
    flex-wrap: wrap;
    margin-top: rem(30);

    &--disabled {
        opacity: 0.3;
    }

    &--errors {
        padding-bottom: rem(16);
    }
}

.legend {
    width: 100%;
    flex-shrink: 0;
}

.description {
    opacity: 0.5;
}

.input-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: rem(15);
    margin-bottom: rem(15);

    &:nth-child(1 of &) {
        margin-top: rem(18);
    }

    &:last-child {
        margin-bottom: initial;
    }

    &::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 30px;
        height: 1px;
        flex-shrink: 0;
        background-color: rgb(1 1 1 / 15%);
        content: '';
    }

    &:last-child::after {
        content: none;
    }
}
</style>
