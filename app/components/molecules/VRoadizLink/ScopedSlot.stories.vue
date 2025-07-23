<script lang="ts" setup></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Node Reference">
            <VRoadizLink
                v-slot="linkProps"
                :reference="{ url: '/page-path' }"
                custom
            >
                <VButton
                    v-bind="linkProps"
                    label="button label"
                    outlined
                />
            </VRoadizLink>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="External url">
            <VRoadizLink
                v-slot="linkProps"
                url="https://google.com"
                custom
            >
                <VButton
                    label="Bind all scoped slot props"
                    v-bind="linkProps"
                />
            </VRoadizLink>
            <VRoadizLink
                v-slot="{ href, target, rel }"
                url="https://google.com"
                custom
            >
                <VButton
                    :href="href"
                    :target="target"
                    :rel="rel"
                    label="Scoped slot props destructuring"
                />
            </VRoadizLink>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="External url">
            <VRoadizLink
                v-slot="{ href, target, rel }"
                url="https://google.com"
                custom
            >
                <VButton
                    :to="href"
                    :target="target"
                    :rel="rel"
                    theme="dark"
                    filled
                    icon-name="check"
                    label="Label"
                />
            </VRoadizLink>
            <VRoadizLink
                v-slot="{ href, target, rel }"
                url="https://google.com"
                custom
            >
                <VButton
                    :to="href"
                    :target="target"
                    :rel="rel"
                    theme="light"
                    filled
                    icon-name="check"
                    label="Label"
                />
            </VRoadizLink>
            <VRoadizLink
                v-slot="linkProps"
                url="https://google.com"
                custom
            >
                <VButton v-bind="linkProps">
                    Slot button label
                    <template #icon>
                        <VIcon name="check" />
                    </template>
                </VButton>
            </VRoadizLink>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
