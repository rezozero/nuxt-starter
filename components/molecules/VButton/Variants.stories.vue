<script setup lang="ts">
import { vButtonSizes } from '~/components/molecules/VButton/VButton.vue'

const commonsProps = {
    label: 'Default label',
    iconName: 'arrow-line-right',
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Menu">
            <VButton
                v-for="size in vButtonSizes"
                :key="`${size}-low`"
                :size="size"
                v-bind="commonsProps"
                variant="menu"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Only css">
            <button :class="$style['button-custom']">
                <span :class="$style.label">Default label</span>
                <VIcon
                    name="arrow-line-right"
                    :class="$style.icon"
                />
            </button>
            <button :class="[$style['button-custom'], $style['button-custom--xl']]">
                <span :class="$style.label">Default label</span>
                <VIcon
                    name="arrow-line-right"
                    :class="$style.icon"
                />
            </button>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module="">
@use 'assets/scss/mixins/v-button' as *;
@use 'assets/scss/variables/v-button' as *;
@use 'assets/scss/variables/v-button-variant' as *;

// .root {
//     --theme-color-buttons-menu-bg: red;
// }
//
// .button-custom {
//     @include v-button-css-vars($v-button);
//     @include v-button-variant-css-vars($v-button-variants, 'menu');
//
//     &--xl {
//         @include v-button-size('xl');
//         @include v-button-size('xl', menu);
//     }
//
//     .label {
//         @include v-button-css-vars($v-button-variant-menu-label, 'label');
//     }
//
//     .icon {
//         @include v-button-css-vars($v-button-variant-menu-icon, 'icon');
//     }
// }
</style>
