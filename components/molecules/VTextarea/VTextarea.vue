<script setup lang="ts">
import type { FormElementProps } from '~/types/form'

const props = defineProps<FormElementProps>()

const emit = defineEmits(['update:modelValue'])

const input = ref<HTMLInputElement | null>(null)

const { isFocused, isFilled, model, onBlur, onFocus } = useTextInput(props, emit, input)
</script>

<template>
    <VFieldWrapper
        :id="id"
        :label="label"
        :focused="isFocused"
        :filled="isFilled"
        :required="required"
        :disabled="disabled"
    >
        <textarea
            v-bind="props"
            :id="id"
            ref="input"
            v-model="model"
            :required="required"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :class="$style.textarea"
            @focus="onFocus"
            @blur="onBlur"
        />
    </VFieldWrapper>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

.textarea {
    min-height: rem(150);
    user-select: auto; // Safari - solving issue when using user-select:none on the <body> text input doesn't working
    white-space: revert; // Revert the 'white-space' property for textarea elements on Safari

    &:focus,
    &:focus-visible {
        outline: none;
    }

    &:disabled {
        background-color: transparent;
    }
}
</style>
