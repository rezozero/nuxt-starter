<template>
    <fieldset :disabled="disabled" :name="name">
        <legend v-if="label">{{ label }}</legend>
        <v-form-element-factory :id="id" :schema="schema" :errors="errors" :parents="internalParents" />
    </fieldset>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import type { PropType } from 'vue'
import FormElement from '~/mixins/FormElement'
import { JsonSchemaExtended } from '~/types/json-schema'

export default mixins(FormElement).extend({
    name: 'VFormFieldset',
    props: {
        schema: {
            type: Object as PropType<JsonSchemaExtended>,
            required: true,
        },
        errors: Object as PropType<Record<string, string>>,
        schemaKey: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    computed: {
        internalParents(): string[] {
            return (this.parents?.slice() || []).concat([this.schemaKey])
        },
    },
})
</script>
