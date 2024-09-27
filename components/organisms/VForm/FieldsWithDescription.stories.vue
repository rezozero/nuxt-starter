<script setup lang="ts">
import schema from './schemas/fields-with-description'
</script>

<template>
    <NuxtStory>
        <VForm :schema="schema" />
    </NuxtStory>
</template>
