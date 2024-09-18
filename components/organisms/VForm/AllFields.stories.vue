<script setup lang="ts">
import schema from './schemas/all-fields'
</script>

<template>
    <NuxtStory>
        <VForm :schema="schema" />
    </NuxtStory>
</template>
