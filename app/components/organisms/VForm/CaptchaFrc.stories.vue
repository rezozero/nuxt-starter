<script setup lang="ts">
import { FRIENDLY_CAPTCHA_INPUT } from '~/utils/captcha/providers/frcCaptcha'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.frcCaptcha.siteKey = 'FCMV995O03V7RIMQ'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [FRIENDLY_CAPTCHA_INPUT]: {
            type: 'string',
            title: 'friendly_captcha',
            propertyOrder: 15,
        },
    },
    required: [FRIENDLY_CAPTCHA_INPUT],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
