<script lang="ts" setup></script>

<template>
    <NuxtStory :class="$style.root">
        <VTag label="Tag label default" />
        <VTag
            label="Tag label sm"
            size="sm"
        />
    </NuxtStory>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

.root {
    :global(.nuxt-story__main) {
        display: flex;
        align-items: flex-start;
        gap: rem(20);
    }
}
</style>
