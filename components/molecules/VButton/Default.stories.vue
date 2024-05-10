<script lang="ts" setup></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VStoryThemeProvider>
                <VButton outlined label="Button outlined" />
                <VButton icon-name="check" label="Button with icon" />
                <VButton icon-name="check" />
            </VStoryThemeProvider>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Outlined">
            <VStoryThemeProvider>
                <VButton label="Button outlined" outlined />
                <VButton icon-name="check" label="Button with icon" outlined />
                <VButton icon-name="check" outlined />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Filled">
            <VStoryThemeProvider>
                <VButton filled label="Button dark theme" />
                <VButton filled icon-name="check" label="Button icon" />
                <VButton filled icon-name="check" />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Disabled">
            <VStoryThemeProvider>
                <VButton disabled icon-name="check" label="default disabled" />
                <VButton disabled icon-name="check" label="outlined disabled" outlined />
                <VButton disabled filled icon-name="check" label="filled disabled" />
            </VStoryThemeProvider>
        </NuxtStoryVariant>

        <NuxtStoryVariant title="Sizes">
            <VButton label="Button S" outlined size="s" />
            <VButton label="Button M" outlined size="m" />
            <VButton label="Button L" outlined size="l" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
