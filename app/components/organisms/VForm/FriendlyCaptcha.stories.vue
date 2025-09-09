<script setup lang="ts">
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.frcCaptcha.siteKey = 'FCMTFP5GAQI2L2E1'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        'text': {
            type: 'string',
            title: 'Text',
        },
        'frc-captcha-response': {
            type: 'string',
            title: 'friendly_captcha',
            propertyOrder: 15,
        },
    },
    required: ['frc-captcha-response'],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
