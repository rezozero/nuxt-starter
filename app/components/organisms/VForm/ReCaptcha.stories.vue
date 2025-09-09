<script setup lang="ts">
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.gRecaptcha.siteKey = '6LeOgMMrAAAAAIkfOLG7S17XMgRtbZLgpNcfQdTp'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        'text': {
            type: 'string',
            title: 'Text',
        },
        'g-recaptcha-response': {
            type: 'string',
            title: 'recaptcha',
            propertyOrder: 15,
        },
    },
    required: ['g-recaptcha-response'],
}

function customSubmit(data) {
    console.log('customSubmit', data)
}
</script>

<template>
    <NuxtStory>
        <VForm
            :submit-callback="customSubmit"
            :schema="(schema as JsonSchemaExtended)"
        />
    </NuxtStory>
</template>
