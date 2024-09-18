<script lang="ts" setup>
const styleList = ['', 'outlined', 'rounded', 'filled', 'elevated', 'disabled', 'loading']
</script>

<template>
    <NuxtStory :class="$style.root">
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

<style lang="scss" module>
.root {
    --theme-color-content-primary: black;
    --theme-color-content-primary-inverted: white;
}
</style>
