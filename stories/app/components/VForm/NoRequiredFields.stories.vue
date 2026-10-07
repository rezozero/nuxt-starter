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
    required: [],
}
</script>

<template>
    <NuxtStory>
        <VForm
            :schema="(schema as JsonSchemaExtended)"
            :gdpr="false"
            novalidate
        />
    </NuxtStory>
</template>
