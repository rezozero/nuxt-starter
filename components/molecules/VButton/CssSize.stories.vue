<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="outlined">
            <VButton
                label="default"
                :class="$style.button"
                icon-name="check"
                outlined
            />
            <VButton
                label="with breakpoint"
                :class="[$style.button, $style['button--responsive']]"
                icon-name="check"
                outlined
            />
            <VButton
                label="SM"
                :class="[$style.button, $style['button--sm']]"
                icon-name="check"
                outlined
            />
            <VButton
                label="MD"
                :class="[$style.button, $style['button--md']]"
                icon-name="check"
                outlined
            />
            <VButton
                label="LG"
                :class="[$style.button, $style['button--lg']]"
                icon-name="check"
                outlined
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/v-button' as *;
@use 'assets/scss/mixins/include-media' as *;

// .button {
//     &--sm {
//         @include v-button-size('sm');
//     }
//
//     &--md {
//         @include v-button-size('md');
//     }
//
//     &--lg {
//         @include v-button-size('lg');
//     }
//
//     &--responsive {
//         @include v-button-size('sm');
//
//         @include media('>=lg') {
//             @include v-button-size('md');
//         }
//
//         @include media('>=xxl') {
//             @include v-button-size('lg');
//         }
//     }
// }
</style>
