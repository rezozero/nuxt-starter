<script lang="ts" setup>
import { vButtonSizes as sizes } from '~/components/molecules/VButton/VButton.vue'
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Primary">
            <VStoryThemeProvider>
                <div
                    v-for="size in sizes"
                    :key="'primary' + size"
                    :class="$style.sizes"
                >
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="primary"
                        label="Extenal"
                        url="https://google.com"
                    />
                    <VRoadizLinkButton
                        :reference="{ url: '/path' }"
                        :size="size"
                        emphasis="primary"
                        label="Internal"
                    />
                    <VRoadizLinkButton
                        :document="{ relativePath: '/document-path.pdf' }"
                        :size="size"
                        emphasis="primary"
                        label="document"
                    />
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="primary"
                        label="Without link"
                    />
                </div>
            </VStoryThemeProvider>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Secondary">
            <VStoryThemeProvider>
                <div
                    v-for="size in sizes"
                    :key="'Secondary' + size"
                    :class="$style.sizes"
                >
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="secondary"
                        label="Extenal"
                        url="https://google.com"
                    />
                    <VRoadizLinkButton
                        :reference="{ url: '/path' }"
                        :size="size"
                        emphasis="secondary"
                        label="Internal"
                    />
                    <VRoadizLinkButton
                        :document="{ relativePath: '/document-path.pdf' }"
                        :size="size"
                        emphasis="secondary"
                        label="document"
                    />
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="secondary"
                        label="Without link"
                    />
                </div>
            </VStoryThemeProvider>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Ternary">
            <VStoryThemeProvider>
                <div
                    v-for="size in sizes"
                    :key="'Ternary' + size"
                    :class="$style.sizes"
                >
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="ternary"
                        label="Extenal"
                        url="https://google.com"
                    />
                    <VRoadizLinkButton
                        :reference="{ url: '/path' }"
                        :size="size"
                        emphasis="ternary"
                        label="Internal"
                    />
                    <VRoadizLinkButton
                        :document="{ relativePath: '/document-path.pdf' }"
                        :size="size"
                        emphasis="ternary"
                        label="document"
                    />
                    <VRoadizLinkButton
                        :size="size"
                        emphasis="ternary"
                        label="Without link"
                    />
                </div>
            </VStoryThemeProvider>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    :global(.nuxt-story-variant__main) {
        flex-direction: column;
        align-items: flex-start;
    }
}

.sizes {
    display: flex;
    flex-wrap: wrap;
    gap: px-to-rem(40);
}
</style>
