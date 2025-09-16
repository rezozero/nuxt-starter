<script lang="ts" setup>
import { LazyVTag } from '#components'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VWrapper wrapper="h1">
                Static H1 tag
            </VWrapper>
        </NuxtStoryVariant>
        <NuxtStoryVariant>
            <VWrapper wrapper="div">
                Static div tag
            </VWrapper>
        </NuxtStoryVariant>
        <NuxtStoryVariant>
            <VWrapper
                :wrapper="LazyVTag"
                label="Static VTag component"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
