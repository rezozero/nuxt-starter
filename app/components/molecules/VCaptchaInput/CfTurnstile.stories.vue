<script lang="ts" setup>
// SiteKey test
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const siteKeyTest = '1x00000000000000000000AA'
const config = useRuntimeConfig()
config.public.cfTurnstile.siteKey = siteKeyTest

const id = useId()
const { setUserConsent } = await useCaptchaProvider({ name: 'cfTurnstile', siteKey: siteKeyTest, id })
</script>

<template>
    <NuxtStory>
        <button @click="setUserConsent(true)">
            valid user consent
        </button>
        <VCaptchaInput
            label="Captcha label"
            name="cf-turnstile-response"
        />
    </NuxtStory>
</template>
