<script lang="ts" setup>
const props = defineProps<{
    label?: string
}>()

const { t, te } = useI18n()
const ouputLabel = computed(() => {
    return {
        short: props.label || te('copyright.short_label') ? t('copyright.short_label') : t('copyright.label'),
        default: props.label || t('copyright.label'),
    }
})
</script>

<template>
    <button
        :class="$style.root"
        :data-label-short="ouputLabel.short"
        :data-label="ouputLabel.default"
    >
        <slot />
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
    padding: 0;
    border: none;
    border-radius: 50vmax;
    text-decoration: initial;

    &::after {
        position: absolute;
        width: max(100%, 52px); // Taller clickable zone on mobile
        height: max(100%, 52px); // Taller clickable zone on mobile
        content: '';
    }

    &::before {
        content: attr(data-label-short);
    }

    @include media('>=lg') {
        &::before {
            content: attr(data-label);
        }
    }

    // remove default label if has slot
    &:has(> * )::before {
        display: none;
    }
}
</style>
