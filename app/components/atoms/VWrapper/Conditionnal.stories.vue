<script lang="ts" setup>
const condition = ref(false)
</script>

<template>
    <NuxtStory>
        <template #aside>
            <button @click="() => condition =!condition">
                Toggle
            </button>
        </template>
        <NuxtStoryVariant>
            <VWrapper :wrapper="condition ? 'h1' : 'h2'">
                Dynamic {{ condition ? 'h1' : 'h2' }} tag
            </VWrapper>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
