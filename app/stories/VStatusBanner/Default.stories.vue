<script lang="ts" setup>
const message = 'Cras mattis consectetur purus sit amet'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="success">
            <VStatusBanner
                status="success"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="warning">
            <VStatusBanner
                status="warning"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="error">
            <VStatusBanner
                status="error"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Neutral">
            <VStatusBanner
                status="neutral"
                :message="message"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<!-- <style module lang="scss"></style> -->
