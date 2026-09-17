<script lang="ts" setup>
const message = 'Cras mattis consectetur purus sit amet'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="success">
            <VStatusMessage
                status="success"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="warning">
            <VStatusMessage
                status="warning"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="error">
            <VStatusMessage
                status="error"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Neutral">
            <VStatusMessage
                status="neutral"
                title="Un exemple de titre"
                :message="message"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<!-- <style module lang="scss"></style> -->
