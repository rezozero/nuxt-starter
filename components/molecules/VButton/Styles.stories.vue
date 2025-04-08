<script lang="ts" setup>
const styleList = ['', 'outlined', 'rounded', 'filled', 'elevated', 'disabled']
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            v-for="propKey in styleList"
            :key="propKey"
            :title="propKey || 'default'"
        >
            <VButton
                label="Mon button"
                :[propKey]="true"
            />
            <VButton
                label="Mon button"
                icon-name="check"
                :[propKey]="true"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
