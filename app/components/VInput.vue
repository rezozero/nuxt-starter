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
        :label="label"
        :required="required"
        :errors="errors"
    >
        <template
            #[slotName]="scopedSlot"
        >
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
                :max="props.type === 'datetime-local' ? '9999-12-31T23:59' : undefined"
                :aria-describedby="scopedSlot?.describedby || undefined"
                @blur="onBlur"
                @focus="onFocus"
                @input="onInput"
            >
            <LazyVCheckbox
                v-if="isCheckbox || isRadio"
                :class="$style.checkbox"
                aria-hidden="true"
            />
        </template>
    </VFieldWrapper>
</template>

<style lang="scss" module>
.input {
    @include form-control(filled);

    &[type='radio'],
    &[type='checkbox'] {
        --v-input-width: initial;

        // Visually hide the input but keep it accessible for screen readers and keyboard navigation
        // VCheckbox will be used to display the custom checkbox/radio UI
        position: absolute;
        z-index: 1; // Ensure the input is above the custom UI for interaction
        overflow: hidden;
        margin: 0;
        inset: 0;
        opacity: 0; // Hide the native checkbox/radio but keep it accessible and clickable
    }

    &[type="date"],
    &[type="datetime-local"] {
        font-family: inherit;
    }

    &[type='file']::file-selector-button {
        padding: 0.4em 1em;
        border: none;
        border-radius: 50vmax;
        margin-right: 12px;
        background-color: var(--button-label-on-light-solid-bg, #000);
        color: var(--button-label-on-light-solid-content, #FFF);
        font-size: 14px;

        [data-theme="dark"] & {
            background-color: var(--button-label-on-dark-solid-bg, #fff);
            color: var(--button-label-on-dark-solid-content, #000);
        }
    }
}

.checkbox {
    margin-right: 10px;
}
</style>
