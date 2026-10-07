<script lang="ts" setup>
useAlternateLinks([
    { locale: 'en', url: '/en' },
    { locale: 'fr', url: '/fr' },
])
</script>

<template>
    <NuxtStory>
        <VLangSwitch />
    </NuxtStory>
</template>
