<script setup lang="ts">
// Keys as they come from the API — snake_case or camelCase are both supported
const known = [
    getSocialLinks('instagram_url', 'https://instagram.com/roadiz'),
    getSocialLinks('facebookUrl', 'https://facebook.com/roadiz'),
    getSocialLinks('linkedin_url', 'https://linkedin.com/company/roadiz'),
    getSocialLinks('youtubeUrl', 'https://youtube.com/@roadiz'),
    getSocialLinks('twitter_url', 'https://twitter.com/roadiz_io'),
]

// An unrecognized key falls back to a generic 'link' icon
const withUnknown = [
    getSocialLinks('instagram_url', 'https://instagram.com/roadiz'),
    getSocialLinks('discord_url', 'https://discord.gg/roadiz'),
    getSocialLinks('linkedin_url', 'https://linkedin.com/company/roadiz'),
]
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VSocialLinks :socials="known" />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="With unknown network">
            <VSocialLinks :socials="withUnknown" />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Custom slot">
            <VSocialLinks :socials="known">
                <template #default="{ social }">
                    <NuxtLink
                        :to="social.url"
                        target="_blank"
                    >
                        {{ social.name }}
                    </NuxtLink>
                </template>
            </VSocialLinks>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
