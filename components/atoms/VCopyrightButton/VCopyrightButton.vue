<script lang="ts"></script>

<template>
    <button
        :class="$style.root"
        :aria-label="$t('information.label')"
    >
        <VIcon
            name="copyright"
            height="8"
            width="8"
        />
    </button>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;
    display: flex;
    width: var(--v-copyright-button-width, #{px-to-rem(16)});
    height: var(--v-copyright-button-height, #{px-to-rem(16)});
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: var(--v-copyright-button-background-color, #fff);
    color: var(--v-copyright-button-foreground-color, #000);
    text-decoration: initial;

    &::before {
        position: absolute;
        width: max(100%, px-to-rem(52)); // Increase size for clickable zone on mobile
        height: max(100%, px-to-rem(52)); // Increase size for clickable zone on mobile
        content: '';
    }

    @include media('>=md') {
        width: var(--v-copyright-button-width, #{px-to-rem(24)});
        height: var(--v-copyright-button-height, #{px-to-rem(24)});
    }
}
</style>
