<template>
    <NuxtStory>
        <NuxtStoryVariant title="Mailto">
            <VRoadizLink
                label="Link"
                url="mailto:john.doe@rezo-zero.com"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Script">
            <VRoadizLink
                label="Link"
                url="javascript:alert('Hello')"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Phone">
            <VRoadizLink
                label="Link"
                url="tel:+33123456789"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<script setup>
</script>
