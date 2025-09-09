<script lang="ts" setup>
const config = useRuntimeConfig()
config.public.gRecaptcha.siteKey = '6LfguS4rAAAAAK3j1r6YtqJtn1nXaMQm4G1eYoSy'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VCaptchaInput
                id="captcha"
                label="Captcha label"
                description="Google ReCaptcha analyze en arrière plan votre comportement pour déterminer si vous n'êtes pas un robot."
                name="g-recaptcha-response"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
