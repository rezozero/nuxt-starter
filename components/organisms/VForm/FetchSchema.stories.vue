<script setup lang="ts">
// TODO: mock the API response (using msw?) and use it in the story
const schema = '/api/custom_forms/1/definition'
</script>

<template>
    <NuxtStory>
        <VForm :schema="schema" />
    </NuxtStory>
</template>
