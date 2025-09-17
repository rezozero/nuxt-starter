<script setup lang="ts">
import type { JsonSchemaExtended } from '~~/types/json-schema'

const schema = {
    title: 'test',
    type: 'object',
    properties: {
        'simple_texte': {
            type: 'string',
            title: 'Texte simple',
        },
        'frc-captcha-response': {
            type: 'string',
            title: 'captcha',
        },
    },
    required: ['simple_texte'],
}

function submitCallback(args: { action?: string, formData?: FormData }): Promise<void> {
    const fetch = useRoadizFetchFactory()

    return fetch('/custom_forms/7/post', {
        method: 'POST',
        body: args.formData,
    })
}

const data = ref({ simple_texte: null })
</script>

<template>
    <NuxtStory>
        <VForm
            v-model="data"
            :schema="(schema as JsonSchemaExtended)"
            :submit-callback="submitCallback"
            :gdpr="false"
            novalidate
        />
    </NuxtStory>
</template>
