<script setup lang="ts">
import type { ThemeOptions } from '#imports'

const props = defineProps<ThemeOptions>()

const { themeClass } = useThemeProvider(props)
</script>

<template>
    <slot v-bind="{ themeClass }" />
</template>

<style module lang="scss">
@use "assets/scss/mixins/theme" as *;

.root {
    @include theme-variants;

    /*! keep */
}
</style>
