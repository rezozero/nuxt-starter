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
@use '~/components/molecules/VButton/v-button';

.button-emphasis-updated {
    @include v-button.size('lg');

    @include media('>=vl') {
        @include v-button.size('sm');
    }
}

.button-size-updated {
    @include media('>=vl') {
        @include v-button.size('lg');
    }
}
</style>
