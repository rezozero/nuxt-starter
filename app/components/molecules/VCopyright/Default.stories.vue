<template>
    <NuxtStory>
        <NuxtStoryVariant title="Content - prop">
            <div :class="$style.container">
                <VCopyright content="Lorem ipsum" />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Content - default slot">
            <div :class="$style.container">
                <VCopyright v-slot="{ id, itemClass, ariaHidden }">
                    <span
                        :id="id"
                        :class="itemClass"
                        :aria-hidden="ariaHidden"
                    >
                        Lorem ipsum
                    </span>
                </VCopyright>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.container {
    position: relative;
    width: 200px;
    height: 100px;
    background-color: lightgrey;
}
</style>
