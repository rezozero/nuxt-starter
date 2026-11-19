<script lang="ts" setup>
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="With context (visually hidden)">
            <a href="/page-path">
                <VLinkLabel
                    label="Learn more"
                    context="Card title"
                />
            </a>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Without context">
            <a href="/page-path">
                <VLinkLabel label="Learn more" />
            </a>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
