<template>
    <v-field-wrapper :id="id" :label="label" :focused="isFocused" :filled="isFilled" :required="required">
        <textarea
            v-bind="props"
            :id="id"
            ref="input"
            v-model="value"
            :required="required"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :class="$style.textarea"
            @focus="onFocus"
            @blur="onBlur"
        ></textarea>
    </v-field-wrapper>
</template>

<script setup lang="ts">
import VFieldWrapper from '~/components/molecules/VFieldWrapper/VFieldWrapper.vue'
import { defaultProps } from '~/utils/form/form-element'

const props = defineProps({
    ...defaultProps,
    id: String,
    modelValue: {
        type: String,
        default: undefined,
    },
    placeholder: String,
})

const input = ref(null) as Ref<HTMLInputElement | null>
const emit = defineEmits(['update:modelValue'])

const { id, label, name, required, disabled } = useFormElement(props)
const { isFocused, isFilled, value, onBlur, onFocus } = useTextInput(props, emit, input)
</script>

<style lang="scss" module>
.textarea {
    //width: 100%;
    min-height: rem(150);

    //border: none;
    //font-weight: bold;

    &:focus,
    &:focus-visible {
        outline: none;
    }

    &:disabled {
        background-color: transparent;
    }
}
</style>
