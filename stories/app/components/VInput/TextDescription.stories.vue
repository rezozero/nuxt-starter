<script setup lang="ts">
const value = ref('Default value')
</script>

<template>
    <NuxtStory>
        <VInput
            v-model="value"
            description="Lorem ipsum"
        />
    </NuxtStory>
</template>
