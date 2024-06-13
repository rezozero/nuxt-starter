<script lang="ts" setup>
import { textInputEmits } from '~/composables/use-text-input'
import type { FormElementProps } from '~/types/form'

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

    &[type='radio'],
    &[type='checkbox'] {
        position: absolute;
        cursor: pointer;
        opacity: 0;
    }

    &[type='file'] {
        margin-top: rem(12);
    }

    &[type='file']::file-selector-button {
        padding: 0.4em 1em;
        border: none;
        border-radius: 1em;
        background-color: rgba(color(black), 0.2);
        font-size: rem(14);

        .root--theme-dark & {
            background-color: rgba(color(white), 0.5);
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
        color: color(black);
        opacity: 0.5;
    }
}

.checkbox {
    --v-checkbox-size: 0.5lh;

    flex-shrink: 0;
    margin-right: rem(14);
}
</style>
