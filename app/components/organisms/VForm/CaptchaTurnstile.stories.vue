<script setup lang="ts">
import { CF_TURNSTILE_INPUT } from '~/utils/captcha/providers/cfTurnstile'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.cfTurnstile.siteKey = '1x00000000000000000000AA'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [CF_TURNSTILE_INPUT]: {
            type: 'string',
            title: 'turnstile captcha',
            propertyOrder: 15,
        },
    },
    required: [CF_TURNSTILE_INPUT],
}
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
