<template>
    <NuxtStory>
        <NuxtStoryVariant title="Content - prop">
            <div :class="$style.container">
                <VCopyright content="Lorem ipsum" />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Content - default slot">
            <div :class="$style.container">
                <VCopyright>Lorem ipsum</VCopyright>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.container {
    position: relative;
    width: rem(200);
    height: rem(100);
    background-color: lightgrey;
}
</style>
