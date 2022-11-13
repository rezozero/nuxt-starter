<template>
    <div>
        <v-form-element-factory :id="id" :schema="schema" :errors="errors" :disabled="disabled" :data="data" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { JsonSchemaExtended } from '~/types/json-schema'
import VFormElementFactory from '~/components/organisms/VForm/VFormElementFactory.vue'

export default Vue.extend({
    name: 'VFormFields',
    components: { VFormElementFactory },
    props: {
        schema: {
            type: Object as PropType<JsonSchemaExtended>,
            required: true,
        },
        data: {
            type: Object as PropType<Record<string, string>>,
            default: () => ({}),
        },
        id: String,
        errors: Object as PropType<Record<string, string>>,
        disabled: Boolean,
    },
})
</script>
