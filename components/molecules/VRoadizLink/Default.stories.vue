<script lang="ts" setup>
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
                url="https://google.com"
            />
            <VRoadizLink
                label="Internal link with url"
                url="/page-test"
            />
            <VRoadizLink
                :url="siteUrlConfigPath"
                label="FullPath url"
            />
            <ClientOnly>
                <VRoadizLink
                    :url="currentBaseUrl"
                    label="currentBase url"
                />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Link without label">
            <VRoadizLink url="https://google.com" />
            <VRoadizLink url="/page-test" />
            <VRoadizLink :url="siteUrlConfigPath" />
            <ClientOnly>
                <VRoadizLink :url="currentBaseUrl" />
            </ClientOnly>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Slot label">
            <VRoadizLink url="https://google.com">
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
                :reference="[page]"
                label="Internal link"
            />
            <VRoadizLink
                :reference="page"
                label="Internal link"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Document link">
            <VRoadizLink
                :document="download"
                label="Document link"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Image link">
            <VRoadizLink
                :class="$style['link-image']"
                :reference="page"
            >
                <NuxtImg
                    :class="$style.img"
                    height="400"
                    provider="interventionRequest"
                    src="01.jpg"
                    width="400"
                />
            </VRoadizLink>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="No link">
            <VRoadizLink
                label="Only label url"
            />
            <VRoadizLink>
                only slot
            </VRoadizLink>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.link-image {
    width: px-to-rem(300);
}

.img {
    width: auto;
    height: auto;
}
</style>
