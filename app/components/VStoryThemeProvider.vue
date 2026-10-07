<script lang="ts" setup>
import type { Theme } from '~~/types/theme'

const { themes } = useAppConfig()
</script>

<template>
    <div :class="$style.root">
        <VThemeProvider
            v-for="theme in themes"
            :key="theme"
            v-slot="{ themeClass }"
            :preferred-theme="(theme as Theme)"
        >
            <div :class="[themeClass, $style.item]">
                <slot :theme="theme" />
            </div>
        </VThemeProvider>
    </div>
</template>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
}

.item {
    display: flex;
    width: 50%;
    flex-wrap: wrap;
    padding: px-to-rem(30);
    background-color: var(--theme-color-surfaces-primary);
    gap: px-to-rem(15);
}
</style>
