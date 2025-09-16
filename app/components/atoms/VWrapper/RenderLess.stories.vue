<script lang="ts" setup>
const hasLink = ref(false)
</script>

<template>
    <NuxtStory>
        <template #aside>
            <button @click="() => hasLink =!hasLink">
                Add a wrapper link
            </button>
        </template>
        <NuxtStoryVariant>
            <VWrapper
                :wrapper="hasLink ? 'a' : undefined"
                :href="hasLink ? '/url' : undefined"
            >
                <span>
                    {{ hasLink ? 'I\'m the same span in a link' : 'I\'m a simple span' }}
                </span>
            </VWrapper>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
