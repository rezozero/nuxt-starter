<script lang="ts" setup>
import { textInputEmits } from '~/composables/use-text-input'
import type { FormElementProps } from '~~/types/form'

type Props = FormElementProps & {
    step?: string
    type?: string
}

const props = defineProps<Props>()

const emit = defineEmits([...textInputEmits])

const input = ref<HTMLInputElement | null>(null)
const { isFilled, isFocused, model, onBlur, onFocus, onInput } = useTextInput(props, emit, input)

const isCheckbox = computed(() => props.type === 'checkbox')

const isRadio = computed(() => props.type === 'radio')

const prefilled = computed(
    () => props.type === 'date' || props.type === 'datetime-local' || props.type === 'file' || !!props.placeholder,
)

const slotName = computed(() => (isCheckbox.value || isRadio.value ? 'beforeLabel' : 'default'))
</script>

<template>
    <VFieldWrapper
        :id="id"
        :description="description"
        :disabled="disabled"
        :filled="isFilled || prefilled"
        :focused="isFocused"
        :hide-separator="hideSeparator"
        :inline="isCheckbox || isRadio"
        :label="label"
        :required="required"
    >
        <template #[slotName]>
            <input
                :id="id"
                ref="input"
                :autocomplete="autocomplete"
                :class="$style.input"
                :disabled="disabled"
                :name="name"
                :placeholder="placeholder"
                :required="required"
                :step="step"
                :type="type"
                :value="model"
                @blur="onBlur"
                @focus="onFocus"
                @input="onInput"
            >
            <LazyVCheckbox
                v-if="isCheckbox || isRadio"
                :class="$style.checkbox"
            />
        </template>
    </VFieldWrapper>
</template>

<style lang="scss" module>
.input {
    width: 100%;
    padding-left: initial;
    border: none;
    grid-column: 1/-1;
    grid-row: 1;
    user-select: auto; // Safari - solving issue when using user-select:none on the <body> text input doesn't working

    &[type='radio'],
    &[type='checkbox'] {
        position: absolute;
        cursor: pointer;
        opacity: 0;
    }

    &[type='file'] {
        margin-top: px-to-rem(12);
    }

    &[type='file']::file-selector-button {
        padding: 0.4em 1em;
        border: none;
        border-radius: 1em;
        background-color: rgb(1 1 1 / 20%);
        font-size: px-to-rem(14);

        .root--theme-dark & {
            background-color: rgb(255 255 255 / 50%);
        }
    }

    &:disabled {
        background-color: transparent;
        opacity: 0.3;
    }

    &:focus-visible {
        outline: none;
    }

    &::placeholder {
        color: rgb(1 1 1);
        opacity: 0.5;
    }
}

.checkbox {
    --v-checkbox-size: 0.5lh;

    flex-shrink: 0;
    margin-right: px-to-rem(14);
}
</style>
