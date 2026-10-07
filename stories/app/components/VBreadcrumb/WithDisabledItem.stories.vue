<script lang="ts" setup>
const items = [
    { label: 'Accueil' },
    { label: 'Sub Page', url: '/sub-page' },
    { label: 'Other sub page' },
    { label: 'An another Page', url: '/an-another-page' },
]
</script>

<template>
    <NuxtStory>
        <VBreadcrumb :items="items" />
    </NuxtStory>
</template>
