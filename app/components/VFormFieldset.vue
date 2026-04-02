<script setup lang="ts">
import { computed } from 'vue'
import type { JsonSchemaExtended } from '~~/types/json-schema'
import type { ComponentsMap } from '~/utils/form/create-form-children'
import type { FormElementProps } from '~~/types/form'
import type { FormModelValue } from '~/components/VFormElementFactory.ts'

interface Props extends FormElementProps<FormModelValue> {
    schema: JsonSchemaExtended
    componentsMap: ComponentsMap
    schemaKey: string
    virtual?: boolean
}

const props = defineProps<Props>()
const generatedId = computed(() => props.id || useId())

const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue as FormModelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})

const internalParents = computed((): string[] => {
    if (props.virtual) {
        return props.parents?.slice() || []
    }
    return (props.parents?.slice() || []).concat([props.schemaKey])
})
</script>

<template>
    <VFieldWrapper
        :id="generatedId"
        :disabled="disabled"
        :name="name"
        :label="label"
        label-tag="legend"
        tag="fieldset"
    >
        <VFormElementFactory
            :id="generatedId"
            v-model="value"
            :schema="schema"
            :errors="errors"
            :parents="internalParents"
            :components-map="componentsMap"
        />
    </VFieldWrapper>
</template>
