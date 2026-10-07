<script setup lang="ts">
import alert from '~stories/assets/fixtures/nodes/alert.json'
</script>

<template>
    <NuxtStory layout="fullscreen">
        <VRoadizAlert :alert="alert" />
    </NuxtStory>
</template>
