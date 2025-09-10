<script lang="ts" setup>
const siteKeyTest = '6LfguS4rAAAAAK3j1r6YtqJtn1nXaMQm4G1eYoSy'

const config = useRuntimeConfig()
config.public.gRecaptcha.siteKey = siteKeyTest

const { setUserConsent } = await useCaptchaProvider({ name: 'gRecaptcha', siteKey: siteKeyTest })
</script>

<template>
    <NuxtStory>
        <button @click="setUserConsent(true)">
            valid user consent
        </button>
        <VCaptchaInput
            id="captcha"
            label="Captcha label"
            description="Google ReCaptcha analyze en arrière plan votre comportement pour déterminer si vous n'êtes pas un robot."
            name="g-recaptcha-response"
        />
    </NuxtStory>
</template>
