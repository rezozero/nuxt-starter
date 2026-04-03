<script setup lang="ts">
import type { JsonSchemaExtended } from '~~/types/json-schema'

const schema = {
    title: 'test',
    type: 'object',
    properties: {
        'texte': {
            type: 'string',
            title: 'Texte',
        },
        'mail': {
            type: 'string',
            title: 'Votre mail',
            attr: {
                'data-group': null,
            },
            description: 'mais votre vrai mail',
            widget: 'email',
            propertyOrder: 2,
        },
        'frc-captcha-response': {
            type: 'string',
            title: 'captcha',
        },
    },
    required: ['texte', 'mail', 'frc-captcha-response'],
}

function submitCallback(args: { action?: string, formData?: FormData }): Promise<void> {
    const fetch = useRoadizFetchFactory()

    return fetch('/custom_forms/7/post', {
        method: 'POST',
        body: args.formData,
    })
}

const data = ref({ 'texte': null, 'mail': null, 'frc-captcha-response': null })
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
