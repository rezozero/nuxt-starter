<script lang="ts" setup>
const message = 'Cras mattis consectetur purus sit amet'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="success">
            <VStatusBanner
                status="success"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="warning">
            <VStatusBanner
                status="warning"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="error">
            <VStatusBanner
                status="error"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Neutral">
            <VStatusBanner
                status="neutral"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<!-- <style module lang="scss"></style> -->
