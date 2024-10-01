<script setup lang="ts">
import alert from '~/assets/stories/fixtures/nodes/alert.json'
</script>

<template>
    <NuxtStory layout="fullscreen">
        <VRoadizAlert :alert="alert" />
    </NuxtStory>
</template>
