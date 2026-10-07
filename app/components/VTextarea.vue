<script setup lang="ts">
import type { FormElementProps } from '~~/types/form'
import { textInputEmits } from '~/composables/use-text-input'

const props = defineProps<FormElementProps<string>>()

const emit = defineEmits([...textInputEmits])

const input = ref<HTMLTextAreaElement | null>(null)

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
        :errors="errors"
        :description="description"
    >
        <template
            #default="scopedSlot"
        >
            <textarea
                :id="id"
                ref="input"
                v-model="model"
                :aria-invalid="errors?.length ? 'true' : undefined"
                :aria-required="required"
                :autocomplete="autocomplete"
                :required="required"
                :placeholder="placeholder"
                :name="name"
                :disabled="disabled"
                :class="$style.textarea"
                :aria-describedby="scopedSlot?.describedby || undefined"
                @focus="onFocus"
                @blur="onBlur"
            />
        </template>
    </VFieldWrapper>
</template>

<style lang="scss" module>
.textarea {
    @include form-control(filled);

    min-height: 150px;
    user-select: auto; // Safari - solving issue when using user-select:none on the <body> text input doesn't working
    white-space: revert; // Revert the 'white-space' property for textarea elements on Safari
}
</style>
