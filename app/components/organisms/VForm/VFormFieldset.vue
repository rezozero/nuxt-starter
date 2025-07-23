<script setup lang="ts">
import { computed } from 'vue'
import type { JsonSchemaExtended } from '~~/types/json-schema'
import type { ComponentsMap } from '~/utils/form/create-form-children'
import type { FormElementProps } from '~~/types/form'

interface Props extends FormElementProps {
    schema: JsonSchemaExtended
    componentsMap: ComponentsMap
    schemaKey: string
    virtual?: boolean
}

const props = defineProps<Props>()

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

<template>
    <fieldset
        :disabled="disabled"
        class="fieldset"
        :class="$style.root"
        :name="name"
    >
        <legend
            v-if="label"
            class="fieldset__legend"
            :class="$style.legend"
        >
            {{ label }}
        </legend>
        <div
            v-if="description"
            class="fieldset__element"
            :class="$style.description"
        >
            <div class="fr-hint-text">
                {{ description }}
            </div>
        </div>
        <div class="fieldset__element">
            <VFormElementFactory
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

<style lang="scss" module>
.root {
    &:not(:first-child) {
        margin-top: px-to-rem(16);
    }

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

.legend,
.description {
    margin-bottom: px-to-rem(16);
}
</style>
