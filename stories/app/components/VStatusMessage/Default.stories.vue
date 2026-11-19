<script lang="ts" setup>
const message = 'Cras mattis consectetur purus sit amet'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="success">
            <VStatusMessage
                status="success"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="warning">
            <VStatusMessage
                status="warning"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="error">
            <VStatusMessage
                status="error"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Neutral">
            <VStatusMessage
                status="neutral"
                :message="message"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<!-- <style module lang="scss"></style> -->
