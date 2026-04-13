<script setup lang="ts">
import commonContent from './fixtures/common-content.json'
import { COMMON_CONTENT_KEY } from '~/composables/use-common-content'

useNuxtApp().payload.data[COMMON_CONTENT_KEY] = commonContent
</script>

<template>
    <NuxtStory>
        <VSocialLinks>
            <template #default="{ social }">
                <NuxtLink
                    :to="social.url"
                    target="_blank"
                >
                    {{ social.name }}
                    <VIcon :name="social.icon" />
                </NuxtLink>
            </template>
        </VSocialLinks>
    </NuxtStory>
</template>
