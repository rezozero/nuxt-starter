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
    align-items: center;
    justify-content: center;
    border: none;
    border: 1px solid #ccc;
    border-radius: 4PX;
    background: #fff;
    text-decoration: initial;

    // Taller clickable zone on mobile
    @media (hover: none) {
        &::after {
            position: absolute;
            width: max(100%, 52px);
            height: max(100%, 52px);
            content: '';
        }
    }
}
</style>
