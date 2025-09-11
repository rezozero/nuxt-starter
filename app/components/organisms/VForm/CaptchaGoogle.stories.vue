<script setup lang="ts">
import captchaFieldKey from '~/utils/captcha/providers.constants'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const config = useRuntimeConfig()
config.public.reCaptcha.siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

const schema = {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
        },
        [captchaFieldKey.RE_CAPTCHA]: {
            type: 'string',
            title: 'recaptcha',
            propertyOrder: 15,
        },
    },
    required: [captchaFieldKey.RE_CAPTCHA],
}
</script>

<template>
    <NuxtStory>
        <VForm
            :schema="(schema as JsonSchemaExtended)"
        />
    </NuxtStory>
</template>
