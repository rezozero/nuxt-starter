<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <template #aside>
            Style are updated on VL breakpoint from css
        </template>
        <NuxtStoryVariant title="Update size depending on breakpoint">
            <VRoadizLinkButton
                url="https://google.com"
                label="Button label"
                emphasis="primary"
                icon-name="chevron-right"
                :class="$style['button-emphasis-updated']"
            />
            <VRoadizLinkButton
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
@use "assets/scss/mixins/include-media" as *;
@use "assets/scss/mixins/v-button" as *;
@use "assets/scss/variables/v-button" as *;

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
