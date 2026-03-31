<script setup lang="ts">
import captchaFieldKey from '~/utils/captcha/providers.constants'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.turnstile.siteKey = '1x00000000000000000000AA'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [captchaFieldKey.TURNSTILE]: {
            type: 'string',
            title: 'turnstile captcha',
            propertyOrder: 15,
        },
    },
    required: [captchaFieldKey.TURNSTILE],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
