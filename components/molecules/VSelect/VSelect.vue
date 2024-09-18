<script lang="ts" setup>
import type { FormElementProps } from '~/types/form'

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
            if (option.selected) {
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
        :disabled="disabled"
        :filled="isFilled"
        :focused="isFocused"
        :hide-separator="multiple"
        :inline="inline"
        :label="label"
    >
        <div :class="[$style.inner, multiple && $style['inner--multiple']]">
            <select
                :class="$style.select"
                :disabled="disabled"
                :multiple="multiple"
                :name="name"
                :required="required"
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
            <SvgIcon
                v-if="!multiple"
                :class="$style.icon"
                height="24"
                name="chevron-down"
                width="24"
            />
        </div>
    </VFieldWrapper>
</template>

<style lang="scss" module>
.inner {
    display: grid;
    align-items: center;

    label + & {
        margin-top: rem(8);
    }

    &--multiple {
        padding: rem(10);
        border: 1px solid $colors-black-30;
    }

    &:not(#{&}--multiple) {
        position: absolute;
        inset: 0;
    }
}

.select {
    border: initial;
    appearance: none;

    // focus-visible is triggered on click
    // https://github.com/w3c/csswg-drafts/issues/5822
    &:focus-visible {
        outline: none;
    }
}

.select[multiple]:focus option:checked,
.select[multiple] option:checked {
    $color: $colors-gray-100; // $colors-black-10;

    background: $color linear-gradient(0deg, $color 0%, $color 100%);
}

.icon {
    position: absolute;
    right: 0;
    pointer-events: none;
}
</style>
