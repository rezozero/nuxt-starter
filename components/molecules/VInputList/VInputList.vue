<template>
    <v-field-wrapper
        :id="id"
        tag="fieldset"
        :label="false"
        :required="required"
        :description="false"
        :class="[$style.root, disabled && $style['root--disabled'], errors && $style['root--errors']]"
        :disabled="disabled"
        hide-separator
    >
        <legend v-if="label" :class="$style.legend">{{ label }} <v-required-mark v-if="required" /></legend>
        <p v-if="description" :class="$style.description">{{ description }}</p>
        <div v-for="option in options" :key="option.value" :class="$style['input-wrapper']">
            <v-input
                :id="id + '-' + option.value"
                :type="multiple ? 'checkbox' : 'radio'"
                :required="option.required"
                :value="option.value"
                :name="`${name}[]`"
                :label="option.label"
                :disabled="disabled"
                hide-separator
                @input="$emit('input', $event.value, { name: `${name}[]` })"
            />
        </div>
    </v-field-wrapper>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import VFieldWrapper from '~/components/molecules/VFieldWrapper/VFieldWrapper.vue'
import { defaultProps } from '~/utils/form/form-element'
import VInput from '~/components/molecules/VInput/VInput.vue'
import VRequiredMark from '~/components/atoms/VRequiredMark/VRequiredMark.vue'

export interface InputListOption {
    label?: string
    value: string
    required?: boolean
}

const props = defineProps({
    ...defaultProps,
    id: String,
    options: Array as PropType<InputListOption[]>,
    multiple: Boolean,
    modelValue: {
        type: String,
        default: undefined,
    },
})

defineEmits(['input'])

const { id, name, label, description, required, disabled, errors } = useFormElement(props)
const multiple = computed(() => props.multiple || false)
const options = computed(() => props.options || [])
</script>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(0 0 0 / 15%);
    margin-top: rem(30);

    &--disabled {
        opacity: 0.3;
    }

    &--errors {
        padding-bottom: rem(16);
    }
}

.legend {
    width: 100%;
    flex-shrink: 0;
}

.description {
    opacity: 0.5;
}

.input-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: rem(9);
    margin-bottom: rem(14);

    &:not(:first-child) {
        margin-top: rem(15);
    }

    &::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 30px;
        height: 1px;
        flex-shrink: 0;
        background-color: rgb(1 1 1 / 15%);
        content: '';
    }

    &:last-child::after {
        content: none;
    }
}
</style>
