<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <template #aside>Style are updated on VL breakpoint from css</template>
        <NuxtStoryVariant title="Update size depending on breakpoint">
            <VButtonLink
                url="https://google.com"
                label="Button label"
                emphasis="primary"
                icon-name="chevron-right"
                :class="$style['button-emphasis-updated']"
            />
            <VButtonLink
                url="https://google.com"
                label="Button label"
                size="s"
                emphasis="primary"
                icon-name="chevron-right"
                :class="$style['button-size-updated']"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.button-emphasis-updated {
    @include v-button-css-vars-by-size($v-button, 'xl');

    @include media('>=vl') {
        @include v-button-css-vars-by-size($v-button, 's');
    }
}

.button-size-updated {
    @include media('>=vl') {
        @include v-button-css-vars-by-size($v-button, 'xl');
    }
}
</style>
