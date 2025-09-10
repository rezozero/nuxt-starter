<script lang="ts" setup>
// SiteKey test
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const siteKeyTest = '1x00000000000000000000AA'
const config = useRuntimeConfig()
config.public.cfTurnstile.siteKey = siteKeyTest

const { setUserConsent } = await useCaptchaProvider({ name: 'cfTurnstile', siteKey: siteKeyTest })
</script>

<template>
    <NuxtStory>
        <button @click="setUserConsent(true)">
            valid user consent
        </button>
        <VCaptchaInput
            id="turnstile"
            label="Captcha label"
            name="cf-turnstile-response"
        />
    </NuxtStory>
</template>
