<script setup lang="ts">
import captchaFieldKey from '~/utils/captcha/providers.constants'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.friendlyCaptcha.siteKey = 'FCMV995O03V7RIMQ'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [captchaFieldKey.FRIENDLY_CAPTCHA]: {
            type: 'string',
            title: 'friendly_captcha',
            propertyOrder: 15,
        },
    },
    required: [captchaFieldKey.FRIENDLY_CAPTCHA],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
