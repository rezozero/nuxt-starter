<script setup lang="ts">
import { RE_CAPTCHA_INPUT } from '~/utils/captcha/providers/gRecaptcha'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.gRecaptcha.siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [RE_CAPTCHA_INPUT]: {
            type: 'string',
            title: 'recaptcha',
            propertyOrder: 15,
        },
    },
    required: [RE_CAPTCHA_INPUT],
}
</script>

<template>
    <NuxtStory>
        <VForm
            :schema="(schema as JsonSchemaExtended)"
        />
    </NuxtStory>
</template>
