<script setup lang="ts">
import download from 'assets/stories/fixtures/documents/download-01.json'
import page from 'assets/stories/fixtures/nodes/page.json'
import { joinURL } from 'ufo'

// Base on runtimeConfig data
const siteUrl = useRuntimeConfig().public.site.url
const siteUrlConfigPath = joinURL(siteUrl, '/random-page')

// Base on client url but not processable in SSR
const currentBaseUrl = computed(() => (window?.origin ? joinURL(window.origin, '/random-page') : undefined))
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Url prop">
            <VLink label="External link with url" url="https:google.com" />
            <VLink label="Internal link with url" url="/page-test" />
            <VLink label="FullPath url" :url="siteUrlConfigPath" />
            <ClientOnly>
                <VLink label="currentBase url" :url="currentBaseUrl" />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Link without label">
            <VLink url="https:google.com" />
            <VLink url="/page-test" />
            <VLink :url="siteUrlConfigPath" />
            <ClientOnly>
                <VLink :url="currentBaseUrl" />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Slot label">
            <VLink url="https:google.com">External Link</VLink>
            <VLink url="/page-test">Internal Link</VLink>
            <VLink :url="siteUrlConfigPath">FullPath url</VLink>
            <ClientOnly>
                <VLink :url="currentBaseUrl">CurrentBase url</VLink>
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Internal link from reference prop">
            <VLink label="Internal link" :reference="[page]" />
            <VLink label="Internal link" :reference="page" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Document link">
            <VLink label="Document link" :document="download" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Image link">
            <VLink :reference="page" :class="$style['link-image']">
                <NuxtImg :class="$style.img" src="01.jpg" provider="interventionRequest" width="400" height="400" />
            </VLink>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.link-image {
    width: rem(300);
}

.img {
    width: auto;
    height: auto;
}
</style>
