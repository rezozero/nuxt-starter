<template>
    <v-field-wrapper :label="label" :focused="isOpen" :filled="isFilled" :disabled="disabled">
        <select
            :name="name"
            tabindex="-1"
            :multiple="multiple"
            :required="required"
            :disabled="disabled"
            @change="onSelectChange"
        >
            <option :selected="!isFilled" value>{{ placeholder }}</option>
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :selected="isSelectedOption(option)"
            >
                {{ option.label }}
            </option>
        </select>
    </v-field-wrapper>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { defaultProps } from '~/utils/form/form-element'
import VFieldWrapper from '~/components/molecules/VFieldWrapper/VFieldWrapper.vue'

export interface SelectOption {
    label: string
    value: string
    selected?: boolean
    disabled?: boolean
}

const props = defineProps({
    ...defaultProps,
    id: String,
    modelValue: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    options: {
        type: Array as PropType<SelectOption[]>,
        default: () => [],
    },
    multiple: Boolean,
})

const emit = defineEmits(['update:modelValue'])
const { label, name, required, disabled } = useFormElement(props)
const isOpen = ref(false)
const multiple = computed(() => props.multiple || false)
const options = computed(() => props.options || [])
const placeholder = computed(() => props.placeholder)
const isFilled = computed(() => {
    if (Array.isArray(props.modelValue)) return props.modelValue.length > 0
    else return !!props.modelValue
})

const isSelectedOption = (option: SelectOption): boolean => {
    if (Array.isArray(props.modelValue)) {
        return typeof props.modelValue.find((value) => value === option.value) !== 'undefined'
    } else {
        return props.modelValue === option.value
    }
}

const getSelectValue = (selectElement: HTMLSelectElement): string | string[] | undefined | null => {
    if (multiple.value) {
        const value = [] as string[]
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i]
            if (option.selected) {
                value.push(option.value)
            }
        }
        return value
    } else {
        return selectElement.value || null
    }
}

const onSelectChange = (event: Event) => {
    emit('update:modelValue', getSelectValue(event.target as HTMLSelectElement))
}
</script>
