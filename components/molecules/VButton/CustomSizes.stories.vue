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
                label="375w: M & 1440w: XL"
                outlined
                :size="false"
                :class="[$style.cta, $style['cta--m-to-xl']]"
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
                xs: m,
                lg: s,
            )
        );
    }

    &--s-to-m {
        @include v-button-responsive-sizes(
            (
                xs: s,
                lg: m,
            )
        );
    }

    &--s-to-l {
        @include v-button-responsive-sizes(
            (
                xs: s,
                lg: l,
            )
        );
    }

    &--m-to-xl {
        @include v-button-responsive-sizes(
            (
                xs: m,
                lg: xl,
            )
        );
    }

    &--l-to-m {
        @include v-button-responsive-sizes(
            (
                xs: l,
                lg: m,
            )
        );
    }
}
</style>
