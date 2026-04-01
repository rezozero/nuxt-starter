<script lang="ts" setup>
import type { FormElementProps } from '~~/types/form'

export interface VSelectOption {
    label: string
    value: string
    selected?: boolean
    disabled?: boolean
}

type SelectValue = string | string[] | undefined | null

type Props = FormElementProps<SelectValue> & {
    options?: VSelectOption[]
    multiple?: boolean
    inline?: boolean
}

const props = defineProps<Props>()

const internalValue = ref(props.modelValue)
watch(
    () => props.modelValue,
    (v) => {
        internalValue.value = v
    },
)
const isFocused = ref(false)
const multiple = computed(() => props.multiple || false)
const options = computed(() => props.options || [])
const placeholder = computed(() => props.placeholder)

const isFilled = computed(() => {
    if (props.placeholder) return true
    if (Array.isArray(internalValue.value)) return internalValue.value.length > 0
    else return !!internalValue.value
})

const isSelectedOption = (option: VSelectOption): boolean => {
    if (Array.isArray(internalValue.value)) {
        return typeof internalValue.value.find(value => value === option.value) !== 'undefined'
    }
    else {
        return internalValue.value === option.value
    }
}

const getSelectValue = (selectElement: HTMLSelectElement): SelectValue => {
    if (multiple.value) {
        const value = [] as string[]
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i]
            if (option?.selected) {
                value.push(option.value)
            }
        }
        return value
    }
    else {
        return selectElement.value || null
    }
}

const emits = defineEmits(['update:modelValue'])
const onSelectChange = (event: Event) => {
    internalValue.value = getSelectValue(event.target as HTMLSelectElement)
    emits('update:modelValue', internalValue.value)
}
</script>

<template>
    <VFieldWrapper
        :id="id"
        :disabled="disabled"
        :filled="isFilled"
        :focused="isFocused"
        :label="label"
        :errors="errors"
        :description="description"
    >
        <template
            #default="scopedSlot"
        >
            <select
                :id="id"
                :class="$style.select"
                :disabled="disabled"
                :multiple="multiple"
                :autocomplete="autocomplete"
                :name="name"
                :required="required"
                :aria-describedby="scopedSlot?.describedby || undefined"
                @blur="() => (isFocused = false)"
                @change="onSelectChange"
                @focus="() => (isFocused = true)"
            >
                <option
                    v-if="!multiple"
                    :selected="!isFilled"
                    value
                >
                    {{ placeholder }}
                </option>
                <option
                    v-for="option in options"
                    :key="option.value"
                    :selected="isSelectedOption(option)"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </template>
    </VFieldWrapper>
</template>

<style lang="scss" module>
@use '~/assets/scss/form';

.select {
    @include form.form-control;

    appearance: initial;
    background-image: url("~/assets/images/icons/form-arrow-down.svg");
    background-position: center right var(--v-select-position-right, 6px);
    background-repeat: no-repeat;
    background-size: var(--v-select-arrow-size, 24px);

    [data-theme="dark"] & {
        background-image: url("~/assets/images/icons/form-arrow-down.svg");
    }
}
</style>
