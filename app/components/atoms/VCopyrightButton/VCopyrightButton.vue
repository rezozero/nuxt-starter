<script lang="ts"></script>

<template>
    <button
        :class="$style.root"
    >
        <VIcon
            name="copyright"
        />
    </button>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;
    display: flex;
    width: var(--v-copyright-button-width, 24px);
    height: var(--v-copyright-button-height, 24px);
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    text-decoration: initial;

    &::before {
        position: absolute;
        width: max(100%, 52px); // Increase size for clickable zone on mobile
        height: max(100%, 52px); // Increase size for clickable zone on mobile
        content: '';
    }
}
</style>
