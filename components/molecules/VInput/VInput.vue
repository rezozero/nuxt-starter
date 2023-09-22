<template>
    <v-field-wrapper
        :id="id"
        :label="label"
        :inline="isCheckbox || isRadio"
        :required="required"
        :disabled="disabled"
        :hide-separator="hideSeparator"
        :focused="isFocused"
        :filled="isFilled || prefilled"
    >
        <template v-if="isCheckbox || isRadio" #beforeLabel>
            <input
                :id="id"
                ref="input"
                v-model="value"
                :step="step"
                :autocomplete="autocomplete"
                :type="type"
                :required="required"
                :name="name"
                :disabled="disabled"
                :placeholder="placeholder"
                @focus="onFocus"
                @blur="onBlur"
            />
        </template>
        <template v-else #default>
            <input
                :id="id"
                ref="input"
                v-model="value"
                :step="step"
                :autocomplete="autocomplete"
                :type="type"
                :required="required"
                :name="name"
                :disabled="disabled"
                :placeholder="placeholder"
                @focus="onFocus"
                @blur="onBlur"
            />
        </template>
    </v-field-wrapper>
</template>

<script setup lang="ts">
// import IconCheck from '~/assets/images/icons/check.svg?sprite'
import VFieldWrapper from '~/components/molecules/VFieldWrapper/VFieldWrapper.vue'
import { defaultProps } from '~/utils/form/form-element'

const props = defineProps({
    ...defaultProps,
    id: String,
    modelValue: {
        type: String,
        default: undefined,
    },
    step: {
        type: String,
        default: undefined,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: String,
})

const emit = defineEmits(['update:modelValue'])
const input = ref(null) as Ref<HTMLInputElement | null>
const { id, label, hideSeparator, disabled, required } = useFormElement(props)
const { isFilled, isFocused, value, onBlur, onFocus } = useTextInput(props, emit, input)

const isCheckbox = computed(() => props.type === 'checkbox')
const isRadio = computed(() => props.type === 'radio')
const prefilled = computed(
    () => props.type === 'date' || props.type === 'datetime-local' || props.type === 'file' || !!props.placeholder,
)
</script>
