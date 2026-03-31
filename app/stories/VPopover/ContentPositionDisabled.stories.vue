<template>
    <NuxtStory :class="$style.root">
        <VPopoverContent
            label="Label"
            open
            positioning-disabled
        >
            <div :class="$style.item">
                Content
            </div>
        </VPopoverContent>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    position: relative;
    height: 100vh;
    translate: 0 0;
}

.item {
    min-width: 300px;
    padding-bottom: 40px;
}
</style>
