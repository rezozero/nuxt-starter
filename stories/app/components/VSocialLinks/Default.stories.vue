<script setup lang="ts">
const list = [
    {
        name: 'Twitter',
        url: 'https://twitter.com/roadiz_io',
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/roadiz.io/',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/roadiz/',
    },
]

const socials = list.map(social => getSocialLinks(social.name, social.url))
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VSocialLinks :socials="socials" />
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Slot">
            <VSocialLinks :socials="socials">
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
