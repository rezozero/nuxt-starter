<script lang="ts" setup></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Node Reference">
            <VLink v-slot="linkProps" :reference="{ url: '/page-path' }" custom>
                <VButton v-bind="linkProps" label="button label" outlined />
            </VLink>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="External url">
            <VLink v-slot="linkProps" url="https://google.com" custom>
                <VButton label="Bind all scoped slot props" v-bind="linkProps" />
            </VLink>
            <VLink v-slot="{ href, target, rel }" url="https://google.com" custom>
                <VButton :href="href" :target="target" :rel="rel" label="Scoped slot props destructuring" />
            </VLink>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="External url">
            <VLink v-slot="{ href, target, rel }" url="https://google.com" custom>
                <VButton :href="href" :target="target" :rel="rel" theme="dark" filled icon-name="check" label="Label" />
            </VLink>
            <VLink v-slot="{ href, target, rel }" url="https://google.com" custom>
                <VButton
                    :href="href"
                    :target="target"
                    :rel="rel"
                    theme="light"
                    filled
                    icon-name="check"
                    label="Label"
                />
            </VLink>
            <VLink v-slot="linkProps" url="https://google.com" custom>
                <VButton v-bind="linkProps">
                    Slot button label
                    <template #icon>
                        <VIcon name="check" />
                    </template>
                </VButton>
            </VLink>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
