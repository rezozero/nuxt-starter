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
            <VRoadizLink
                label="External link with url"
                url="https:google.com"
            />
            <VRoadizLink
                label="Internal link with url"
                url="/page-test"
            />
            <VRoadizLink
                label="FullPath url"
                :url="siteUrlConfigPath"
            />
            <ClientOnly>
                <VRoadizLink
                    label="currentBase url"
                    :url="currentBaseUrl"
                />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Link without label">
            <VRoadizLink url="https:google.com" />
            <VRoadizLink url="/page-test" />
            <VRoadizLink :url="siteUrlConfigPath" />
            <ClientOnly>
                <VRoadizLink :url="currentBaseUrl" />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Slot label">
            <VRoadizLink url="https:google.com">
                External Link
            </VRoadizLink>
            <VRoadizLink url="/page-test">
                Internal Link
            </VRoadizLink>
            <VRoadizLink :url="siteUrlConfigPath">
                FullPath url
            </VRoadizLink>
            <ClientOnly>
                <VRoadizLink :url="currentBaseUrl">
                    CurrentBase url
                </VRoadizLink>
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Internal link from reference prop">
            <VRoadizLink
                label="Internal link"
                :reference="[page]"
            />
            <VRoadizLink
                label="Internal link"
                :reference="page"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Document link">
            <VRoadizLink
                label="Document link"
                :document="download"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Image link">
            <VRoadizLink
                :reference="page"
                :class="$style['link-image']"
            >
                <NuxtImg
                    :class="$style.img"
                    src="01.jpg"
                    provider="interventionRequest"
                    width="400"
                    height="400"
                />
            </VRoadizLink>
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
