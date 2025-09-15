<script setup lang="ts">
import captchaFieldKey from '~/utils/captcha/providers.constants'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.hCaptcha.siteKey = '10000000-ffff-ffff-ffff-000000000001'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [captchaFieldKey.H_CAPTCHA]: {
            type: 'string',
            title: 'h Captcha',
            propertyOrder: 15,
        },
    },
    required: [captchaFieldKey.H_CAPTCHA],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
