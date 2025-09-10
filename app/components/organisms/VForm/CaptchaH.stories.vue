<script setup lang="ts">
import { H_CAPTCHA_INPUT } from '~/utils/captcha/providers/hCaptcha'
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
        [H_CAPTCHA_INPUT]: {
            type: 'string',
            title: 'h Captcha',
            propertyOrder: 15,
        },
    },
    required: [H_CAPTCHA_INPUT],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
