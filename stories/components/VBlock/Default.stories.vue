<script setup lang="ts">
const walker = {
    '@id': '',
    '@type': '',
    'item': {
        slug: 'block-slug',
    },
    'children': [],
}
</script>

<template>
    <NuxtStory>
        <VBlock :item="walker.item">
            <h1>Contenu du block</h1>
        </VBlock>
    </NuxtStory>
</template>
