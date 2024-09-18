<script lang="ts"></script>

<template>
    <VButton
        :class="$style.root"
        :aria-label="$t('information.label')"
    >
        <VIcon
            name="copyright"
            height="7"
            width="7"
        />
    </VButton>
</template>

<style lang="scss" module>
.root {
    width: var(--v-information-button-width, #{rem(18 + 8 * 2)}); // Increase size for clickable zone on mobile
    height: var(--v-information-button-height, #{rem(18 + 8 * 2)}); // Increase size for clickable zone on mobile
    color: var(--v-information-button-foreground-color, #000);
    isolation: isolate;

    &::before {
        position: absolute;
        z-index: -1;
        width: rem(18);
        height: rem(18);
        border-radius: 100vmax;
        background-color: var(--v-information-button-background-color, #fff);
        content: '';
    }

    @include media('>=md') {
        width: var(--v-information-button-width, #{rem(20 + 8 * 2)});
        height: var(--v-information-button-height, #{rem(20 + 8 * 2)});

        &::before {
            width: rem(20);
            height: rem(20);
        }
    }
}
</style>
