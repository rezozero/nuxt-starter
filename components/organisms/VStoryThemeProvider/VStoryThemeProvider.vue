<script lang="ts" setup>
const { themes } = useAppConfig()
</script>

<template>
    <div :class="$style.root">
        <VThemeProvider
            v-for="theme in themes"
            :key="theme"
            v-slot="{ themeClass }"
            :preferred-theme="theme"
        >
            <div :class="[themeClass, $style.item]">
                <slot :theme="theme" />
            </div>
        </VThemeProvider>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    display: flex;
    flex-wrap: wrap;
}

.item {
    display: flex;
    width: 50%;
    flex-wrap: wrap;
    padding: rem(30);
    background-color: var(--theme-color-surfaces-primary);
    gap: rem(15);
}
</style>
