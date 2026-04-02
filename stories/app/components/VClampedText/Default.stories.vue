<script setup lang="ts">
const content
    = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a urna vitae mauris pharetra blandit ac id libero. Aenean vehicula arcu vitae leo mattis, in sodales arcu lacinia. Sed posuere lacus et sem condimentum tristique. Donec et nunc quam. Vivamus mattis justo ac tristique efficitur. In quis enim eget lectus iaculis vulputate. Donec pretium odio gravida purus egestas commodo. Nulla facilisi. Sed mattis, lorem quis fermentum blandit, eros lorem pulvinar felis, fringilla tempor nunc ex sed ligula.\n'

const markdown = `
## Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit. **This is bold text**. Maecenas a urna vitae mauris pharetra blandit ac id libero.
Vestibulum vitae sollicitudin turpis. Quisque mattis vulputate nisi, eu euismod elit mattis eu. In quis est ipsum. Sed volutpat luctus dictum. Morbi at nisl ut libero elementum vulputate eu sit amet tellus. In hac habitasse platea dictumst. Vivamus quam tortor, accumsan eget sodales et, tempus et odio. Suspendisse pretium dui at est congue, sit amet auctor eros tincidunt. Aliquam lobortis interdum dui vitae semper. Quisque efficitur efficitur hendrerit.
> Je me suis rendue au Musée de l’Homme, et là, à ma grande surprise, on m’a sorti des enregistrements sur cylindres de cire de chants de l’Aurès captés dans les années 20 et 30 par des anthropologues, ethnologues, musicologues.
`
</script>

<template>
    <NuxtStory
        layout="fullscreen"
        :class="$style.root"
    >
        <NuxtStoryVariant title="Default">
            <VClampedText
                :content="content"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="5 lines">
            <VClampedText
                :content="content"
                :lines="5"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="No line">
            <VClampedText
                :content="content"
                :lines="0"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Markdown">
            <VClampedText
                :content="markdown"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Disabled">
            <VClampedText
                content="Lorem ipsum"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    width: 500px;
}
</style>
