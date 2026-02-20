<script lang="ts" setup>
const config = useRuntimeConfig()
// SiteKey test
// https://docs.hcaptcha.com/fr/#tests-dint%C3%A9gration--cl%C3%A9s-de-test
config.public.hCaptcha.siteKey = '10000000-ffff-ffff-ffff-000000000001'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VCaptchaInput
                id="h-captcha"
                label="HCaptcha label"
                name="h-captcha-response"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
