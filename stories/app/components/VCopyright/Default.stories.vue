<template>
    <NuxtStory>
        <NuxtStoryVariant title="Content - prop">
            <div :class="$style.container">
                <VCopyright
                    content="Lorem ipsum"
                    :class="$style.copyright"
                />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Content - default slot">
            <div :class="$style.container">
                <VCopyright
                    v-slot="{ id, itemClass, isExpanded }"
                    :class="$style.copyright"
                >
                    <span
                        :id="id"
                        :class="itemClass"
                        :aria-hidden="!isExpanded"
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

.copyright {
    position: absolute;
    right: 12px;
    bottom: 12px;
}
</style>
