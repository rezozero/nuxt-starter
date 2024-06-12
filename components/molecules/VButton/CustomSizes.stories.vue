<script setup lang="ts"></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Custom responsive breakpoints">
            <VButton
                label="375w: M & 1440w: S"
                outlined
                :size="false"
                :class="[$style.cta, $style['cta--m-to-s']]"
                icon-name="check"
            />
            <VButton
                label="375w: S & 1440w: M"
                outlined
                :size="false"
                :class="[$style.cta, $style['cta--s-to-m']]"
                icon-name="check"
            />
            <VButton
                label="375w: S & 1440w: L"
                outlined
                :size="false"
                :class="[$style.cta, $style['cta--s-to-l']]"
                icon-name="check"
            />
            <VButton
                label="375w: L & 1440w: M"
                outlined
                :size="false"
                :class="[$style.cta, $style['cta--l-to-m']]"
                icon-name="check"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.cta {
    &--m-to-s {
        @include v-button-responsive-sizes(
            (
                xs: md,
                lg: sm,
            )
        );
    }

    &--s-to-m {
        @include v-button-responsive-sizes(
            (
                xs: sm,
                lg: md,
            )
        );
    }

    &--s-to-l {
        @include v-button-responsive-sizes(
            (
                xs: sm,
                lg: lg,
            )
        );
    }

    &--l-to-m {
        @include v-button-responsive-sizes(
            (
                xs: lg,
                lg: md,
            )
        );
    }
}
</style>
