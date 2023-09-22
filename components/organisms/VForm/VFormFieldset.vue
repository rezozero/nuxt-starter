<template>
    <fieldset :disabled="disabled" class="fieldset" :class="$style.root" :name="name">
        <legend v-if="label" class="fieldset__legend">
            {{ label }}
        </legend>
        <div v-if="description" class="fieldset__element">
            <div class="fr-hint-text">
                {{ description }}
            </div>
        </div>
        <div class="fieldset__element">
            <v-form-element-factory
                :id="id"
                v-model="value"
                :schema="schema"
                :errors="errors"
                :parents="internalParents"
                :components-map="componentsMap"
            />
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { JsonSchemaExtended } from '~/types/json-schema'
import VFormElementFactory from '~/components/organisms/VForm/VFormElementFactory'
import { defaultProps, Violation } from '~/utils/form/form-element'
import { ComponentsMap } from '~/utils/form/create-form-children'

const props = defineProps({
    ...defaultProps,
    modelValue: {
        type: Object as PropType<Record<string, unknown>>,
        required: false,
        default: () => {},
    },
    schema: {
        type: Object as PropType<JsonSchemaExtended>,
        required: true,
    },
    errors: {
        type: Array as PropType<Violation[]>,
        default: undefined,
    },
    componentsMap: {
        type: Object as PropType<ComponentsMap>,
        required: true,
    },
    schemaKey: {
        type: String,
        required: true,
    },
    virtual: {
        type: Boolean,
        required: false,
        default: false,
    },
    id: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
    get() {
        return props.modelValue
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

<style lang="scss" module>
.root {
    &:not(:last-child) {
        &::after {
            width: 100%;
            border-bottom: 1px dashed var(--border-default-grey);
            margin: 0.5rem;
            content: '';
        }
    }

    &:last-child {
        margin-bottom: 0;

        .element {
            margin-bottom: 0;
        }
    }
}
</style>
