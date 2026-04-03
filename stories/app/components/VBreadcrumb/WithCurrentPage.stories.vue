<script lang="ts" setup>
const route = useRoute()
const items = [
    { label: 'Accueil', url: '/' },
    { label: 'Sub Page', url: '/sub-page' },
    { label: 'Current Page', url: route.path },
]
</script>

<template>
    <NuxtStory>
        <VBreadcrumb :items="items" />
    </NuxtStory>
</template>
