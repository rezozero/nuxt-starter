<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <template #aside>
            Style are updated on VL breakpoint from css
        </template>
        <NuxtStoryVariant title="Update size depending on breakpoint">
            <VLinkButton
                url="https://google.com"
                label="Button label"
                emphasis="primary"
                icon-name="chevron-right"
                :class="$style['button-emphasis-updated']"
            />
            <VLinkButton
                url="https://google.com"
                label="Button label"
                size="sm"
                emphasis="primary"
                icon-name="chevron-right"
                :class="$style['button-size-updated']"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.button-emphasis-updated {
    @include v-button-css-vars-by-size($v-button, 'lg');

    @include media('>=vl') {
        @include v-button-css-vars-by-size($v-button, 'sm');
    }
}

.button-size-updated {
    @include media('>=vl') {
        @include v-button-css-vars-by-size($v-button, 'lg');
    }
}
</style>
