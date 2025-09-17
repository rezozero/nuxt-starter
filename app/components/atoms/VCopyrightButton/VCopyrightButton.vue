<script lang="ts" setup>
defineProps<{
    label?: string
}>()
</script>

<template>
    <button
        :class="$style.root"
    >
        <slot>{{ label || $t('copyright.button_label') }}</slot>
    </button>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    min-width: var(--v-copyright-button-width, 24px);
    min-height: var(--v-copyright-button-height, 24px);
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50vmax;
    text-decoration: initial;

    &::after {
        position: absolute;
        width: max(100%, 52px); // Taller clickable zone on mobile
        height: max(100%, 52px); // Taller clickable zone on mobile
        content: '';
    }
}
</style>
