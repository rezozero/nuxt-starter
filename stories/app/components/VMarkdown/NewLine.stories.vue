<script lang="ts" setup>
const content = 'First line \n\n new line with \\n\\n'
const contentTemplateString = `First line

new line with backspace`
const htmlHexaCode = `Title &#x0A; new line`
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Content with \n\n">
            <VMarkdown
                :content="content"
                class="text-button-md"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Template string with backspace">
            <VMarkdown
                :content="contentTemplateString"
                class="text-button-md"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Hexa code">
            <VMarkdown
                :class="$style['html-code']"
                :content="htmlHexaCode"
                class="text-button-md"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.html-code {
    white-space: pre-line;
}
</style>
