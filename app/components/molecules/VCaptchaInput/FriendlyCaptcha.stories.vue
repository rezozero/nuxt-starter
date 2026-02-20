<script lang="ts" setup>
const config = useRuntimeConfig()
config.public.friendlyCaptcha.siteKey = 'FCMV995O03V7RIMQ'
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
