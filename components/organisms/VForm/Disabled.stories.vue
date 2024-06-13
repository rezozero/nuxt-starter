<script setup lang="ts">
import schema from './schemas/disabled'
</script>

<template>
    <NuxtStory>
        <VForm :schema="schema" disabled />
    </NuxtStory>
</template>
