<script setup lang="ts">
const value = 'Default value'
</script>

<template>
    <NuxtStory>
        <VInput v-model="value" description="Lorem ipsum" />
    </NuxtStory>
</template>
