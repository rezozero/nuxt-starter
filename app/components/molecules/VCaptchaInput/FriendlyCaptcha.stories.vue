<script lang="ts" setup>
const config = useRuntimeConfig()
config.public.frcCaptcha.siteKey = 'FCMTFP5GAQI2L2E1'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VCaptchaInput
                id="captcha"
                label="FriendlyCaptcha label"
                name="frc-captcha-response"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
