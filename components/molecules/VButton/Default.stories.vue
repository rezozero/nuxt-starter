<script lang="ts" setup>
import { vButtonSizes as sizes } from '~/components/molecules/VButton/VButton.vue'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VStoryThemeProvider>
                <VButton label="Button outlined" />
                <VButton
                    icon-name="check"
                    label="Button with icon"
                />
                <VButton icon-name="check" />
            </VStoryThemeProvider>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Outlined">
            <VStoryThemeProvider>
                <VButton
                    label="Button outlined"
                    outlined
                />
                <VButton
                    icon-name="check"
                    label="Button with icon"
                    outlined
                />
                <VButton
                    icon-name="check"
                    outlined
                />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Filled">
            <VStoryThemeProvider>
                <VButton
                    filled
                    label="Button dark theme"
                />
                <VButton
                    filled
                    icon-name="check"
                    label="Button icon"
                />
                <VButton
                    filled
                    icon-name="check"
                />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Disabled">
            <VStoryThemeProvider>
                <VButton
                    disabled
                    icon-name="check"
                    label="default disabled"
                />
                <VButton
                    disabled
                    icon-name="check"
                    label="outlined disabled"
                    outlined
                />
                <VButton
                    disabled
                    filled
                    icon-name="check"
                    label="filled disabled"
                />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Sizes">
            <VStoryThemeProvider>
                <VButton
                    v-for="size in sizes"
                    :key="`${size}-size-theme-default`"
                    :label="`Button ${size}`"
                    outlined
                    :size="size"
                />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Theme prop">
            <VButton
                :label="`Button Dark`"
                theme="dark"
                outlined
            />
            <VButton
                :label="`Button Dark`"
                theme="light"
                outlined
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
