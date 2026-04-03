<script lang="ts" setup>
import type { FormElementProps } from '~~/types/form'

export interface InputListOption {
    label?: string
    value: string
    required?: boolean
}

interface Props extends FormElementProps {
    options?: InputListOption[]
    multiple?: boolean
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
        :disabled="disabled"
        :label="label"
        :required="required"
        :errors="errors"
        tag="fieldset"
        label-tag="legend"
        :description="description"
    >
        <VInput
            v-for="(option, index) in options"
            :id="id + '-' + option.value"
            :key="index"
            v-model="option.value"
            :disabled="disabled"
            :label="option.label"
            :name="`${name}[]`"
            :required="option.required"
            :type="multiple ? 'checkbox' : 'radio'"
            @input="onOptionInput(option.value)"
        />
        <input
            v-if="displayRequiredGroupInput"
            class="visually-hidden"
            required
            type="checkbox"
            tabindex="-1"
        >
    </VFieldWrapper>
</template>
